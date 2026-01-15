
import React, { useState, useEffect } from 'react';
import { Dalolatnoma, Book } from '../types';
import { saveDalolatnoma, updateDalolatnoma, fetchDalolatnomalar } from '../firebase';
import { DEPARTMENTS } from './Constants';

interface ActFormProps {
  onSuccess: (act: Dalolatnoma) => void;
  initialData?: Dalolatnoma | null;
}

const ActForm: React.FC<ActFormProps> = ({ onSuccess, initialData }) => {
  const [loading, setLoading] = useState(false);
  const [existingNumbers, setExistingNumbers] = useState<string[]>([]);
  const [isOtherDept, setIsOtherDept] = useState(false);
  
  const [act, setAct] = useState<Omit<Dalolatnoma, 'id' | 'createdAt'>>({
    actNumber: initialData?.actNumber || '',
    date: initialData?.date || new Date().toISOString().split('T')[0],
    printDate: initialData?.printDate || new Date().toISOString().split('T')[0],
    receiverEmployees: initialData?.receiverEmployees || 'Ortiqova M, Mustafayeva R',
    giverFaculty: initialData?.giverFaculty || DEPARTMENTS[0],
    giverTitle: initialData?.giverTitle || 'Kafedra mudiri',
    giverName: initialData?.giverName || '',
    userType: initialData?.userType || 'ichki',
    status: initialData?.status || 'yangi',
    actDescription: initialData?.actDescription || 'badiiy adabiyotlar majmuasi',
    books: initialData?.books || [
      {
        id: Math.random().toString(36).substr(2, 9),
        author: '',
        title: '',
        bookCategory: '',
        isbn: '',
        pages: 0,
        department: '',
        titlesCount: 1,
        copiesCount: 1,
        pricePerCopy: 0,
        totalSum: 0,
      }
    ],
  });

  useEffect(() => {
    const checkActs = async () => {
      const data = await fetchDalolatnomalar();
      const numbers = data.map((a: any) => a.actNumber);
      setExistingNumbers(numbers);
      
      if (!initialData) {
        const nums = numbers.map((n: string) => {
          const match = n.match(/\d+/);
          return match ? parseInt(match[0]) : 0;
        });
        const nextNum = nums.length > 0 ? Math.max(...nums) + 1 : 1;
        setAct(prev => ({ ...prev, actNumber: `${nextNum}` }));
      }
    };
    checkActs();
  }, [initialData]);

  const handleActChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'giverFaculty' && value === 'Boshqa') {
      setIsOtherDept(true);
      setAct({ ...act, giverFaculty: '' });
    } else {
      setAct({ ...act, [name]: value });
    }
  };

  const handleBookChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const updatedBooks = [...act.books];
    const { name, value, type } = e.target;
    const val = type === 'number' ? Number(value) : value;
    
    updatedBooks[index] = { ...updatedBooks[index], [name]: val };

    if (name === 'pricePerCopy' || name === 'copiesCount' || name === 'titlesCount') {
      const price = updatedBooks[index].pricePerCopy;
      const copies = updatedBooks[index].copiesCount;
      // Calculation: price per copy * total copies
      updatedBooks[index].totalSum = price * copies;
    }

    setAct({ ...act, books: updatedBooks });
  };

  const addBook = () => {
    setAct({
      ...act,
      books: [...act.books, { 
        id: Math.random().toString(36).substr(2, 9), 
        author: '', 
        title: '', 
        bookCategory: '', 
        isbn: '',
        pages: 0,
        department: '', 
        titlesCount: 1, 
        copiesCount: 1, 
        pricePerCopy: 0, 
        totalSum: 0 
      }],
    });
  };

  const removeBook = (index: number) => {
    if (act.books.length > 1) {
      setAct({ ...act, books: act.books.filter((_, i) => i !== index) });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!initialData && existingNumbers.includes(act.actNumber)) {
      alert("Xatolik: Bunday raqamli dalolatnoma tizimda mavjud!");
      return;
    }
    setLoading(true);
    try {
      if (initialData) {
        await updateDalolatnoma(initialData.id, act);
        onSuccess({ id: initialData.id, ...act, createdAt: initialData.createdAt });
      } else {
        const saved = await saveDalolatnoma(act);
        onSuccess({ id: saved.id, ...act, createdAt: Date.now() });
      }
    } catch (err) {
      alert("Xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 animate-fade-in">
      <form onSubmit={handleSubmit} className="bg-white shadow-xl shadow-blue-900/5 rounded-[2.5rem] border border-slate-200/60 overflow-hidden">
        <div className="bg-slate-900 p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">
              {initialData ? 'Tahrirlash' : 'Yangi Dalolatnoma'}
            </h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">Ma'lumotlarni to'ldirish</p>
          </div>
          <div className="flex bg-slate-800 rounded-2xl p-1 gap-1 border border-slate-700">
            <button type="button" onClick={() => setAct({...act, userType: 'ichki'})} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${act.userType === 'ichki' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>Ichki</button>
            <button type="button" onClick={() => setAct({...act, userType: 'tashqi'})} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${act.userType === 'tashqi' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>Tashqi</button>
          </div>
        </div>

        <div className="p-8 space-y-10">
          <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Dalolatnoma №</label>
              <input required type="text" name="actNumber" value={act.actNumber} onChange={handleActChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-slate-800 outline-none focus:border-blue-500 transition-all" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hujjat sanasi</label>
              <input required type="date" name="date" value={act.date} onChange={handleActChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-slate-800 outline-none focus:border-blue-500 transition-all" />
            </div>
            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kitob tavsifi</label>
              <input required type="text" name="actDescription" value={act.actDescription} onChange={handleActChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-slate-800 outline-none focus:border-blue-500 transition-all" placeholder="Masalan: badiiy adabiyotlar majmuasi..." />
            </div>
          </section>

          <section className="bg-slate-50 p-6 rounded-[2rem] border border-slate-200/60 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kafedra / Tashkilot</label>
              <input required type="text" name="giverFaculty" value={act.giverFaculty} onChange={handleActChange} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-slate-800 outline-none focus:border-blue-500 transition-all" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Lavozimi</label>
              <input required type="text" name="giverTitle" value={act.giverTitle} onChange={handleActChange} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-slate-800 outline-none focus:border-blue-500 transition-all" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">F.I.SH</label>
              <input required type="text" name="giverName" value={act.giverName} onChange={handleActChange} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-slate-800 outline-none focus:border-blue-500 transition-all" />
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Kitoblar va parametrlar</h3>
              <button type="button" onClick={addBook} className="bg-slate-900 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-slate-800 transition-all">+ Qo'shish</button>
            </div>

            <div className="space-y-4">
              {act.books.map((book, idx) => (
                <div key={book.id} className="p-5 bg-slate-50/50 rounded-[1.5rem] border border-slate-100 relative group transition-all hover:bg-white hover:shadow-lg">
                  <button type="button" onClick={() => removeBook(idx)} className="absolute -top-2 -right-2 bg-white text-red-500 w-8 h-8 rounded-full shadow-lg border border-red-50 opacity-0 group-hover:opacity-100 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">&times;</button>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    <div className="md:col-span-3">
                      <label className="text-[8px] font-black text-slate-400 uppercase mb-1 block">Muallif, nomi, turi</label>
                      <input required type="text" name="author" value={book.author} onChange={(e) => handleBookChange(idx, e)} className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs outline-none focus:border-blue-500" placeholder="A. Navoiy, 'Xamsa', darslik" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-[8px] font-black text-slate-400 uppercase mb-1 block">Bo'limi</label>
                      <input required type="text" name="department" value={book.department} onChange={(e) => handleBookChange(idx, e)} className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs outline-none focus:border-blue-500" placeholder="Badiiy bo'lim" />
                    </div>
                    <div className="md:col-span-1">
                      <label className="text-[8px] font-black text-slate-400 uppercase mb-1 block">Nomda</label>
                      <input required type="number" name="titlesCount" value={book.titlesCount} onChange={(e) => handleBookChange(idx, e)} className="w-full px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold outline-none" />
                    </div>
                    <div className="md:col-span-1">
                      <label className="text-[8px] font-black text-slate-400 uppercase mb-1 block">Nusxada</label>
                      <input required type="number" name="copiesCount" value={book.copiesCount} onChange={(e) => handleBookChange(idx, e)} className="w-full px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold outline-none" />
                    </div>
                    <div className="md:col-span-1">
                      <label className="text-[8px] font-black text-slate-400 uppercase mb-1 block">Beti</label>
                      <input required type="number" name="pages" value={book.pages} onChange={(e) => handleBookChange(idx, e)} className="w-full px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-xs outline-none" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-[8px] font-black text-slate-400 uppercase mb-1 block">Summasi (dona)</label>
                      <input required type="number" name="pricePerCopy" value={book.pricePerCopy} onChange={(e) => handleBookChange(idx, e)} className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-blue-600 outline-none" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-[8px] font-black text-slate-400 uppercase mb-1 block">Jami summa</label>
                      <div className="w-full px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-black text-center text-slate-700">
                        {book.totalSum.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-slate-900 p-8 rounded-[2rem] text-white flex flex-col md:flex-row justify-between items-center gap-6">
               <div className="flex gap-10">
                  <div className="text-center md:text-left">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Jami nomda</p>
                    <p className="text-2xl font-black">{act.books.reduce((sum, b) => sum + b.titlesCount, 0)}</p>
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Jami nusxada</p>
                    <p className="text-2xl font-black">{act.books.reduce((sum, b) => sum + b.copiesCount, 0)}</p>
                  </div>
               </div>
               <div className="text-right">
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Umumiy Summa</p>
                  <p className="text-3xl font-black text-blue-400">{act.books.reduce((sum, b) => sum + b.totalSum, 0).toLocaleString()} SO'M</p>
               </div>
            </div>
          </section>

          <div className="flex justify-end gap-4 pt-6">
            <button disabled={loading} type="submit" className="bg-blue-600 text-white px-12 py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl hover:bg-blue-700 transition-all flex items-center gap-2">
              {loading ? 'Saqlanmoqda...' : 'Hujjatni shakllantirish'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ActForm;
