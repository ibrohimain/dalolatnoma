
import { Dalolatnoma } from '@/types';
import React from 'react';
// import { Dalolatnoma } from '../types';
// 
interface VerificationViewProps {
  act: Dalolatnoma;
}

const VerificationView: React.FC<VerificationViewProps> = ({ act }) => {
  const totalTitles = act.books.reduce((acc, b) => acc + (b.titlesCount || 0), 0);
  const totalCopies = act.books.reduce((acc, b) => acc + (b.copiesCount || 0), 0);
  const grandTotalSum = act.books.reduce((acc, b) => acc + (b.totalSum || 0), 0);

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 animate-fade-in">
      <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-green-100">
        <div className="bg-green-600 p-8 text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tighter">Hujjat Tasdiqlangan</h2>
          <p className="text-green-100 text-xs font-bold uppercase tracking-widest mt-1">JizPI ARM Tizimi orqali tekshirildi</p>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-slate-50 p-4 rounded-2xl">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Hujjat №</p>
              <p className="font-bold text-slate-800">{act.actNumber}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Sana</p>
              <p className="font-bold text-slate-800">{new Date(act.date).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl">
            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Topshiruvchi</p>
            <p className="font-bold text-slate-800 uppercase">{act.giverName}</p>
            <p className="text-xs text-slate-500">{act.giverFaculty}</p>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Adabiyotlar ma'lumotlari</h3>
            <div className="space-y-4">
              {act.books.map((book, idx) => (
                <div key={idx} className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <div>
                      <p className="text-sm font-bold text-slate-800">{book.author} "{book.title}"</p>
                      <p className="text-[10px] text-slate-500">{book.bookCategory} | {book.publisher} ({book.year})</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[10px] font-black text-slate-400 uppercase">{book.copiesCount} nusxa</p>
                      <p className="text-xs font-bold text-slate-800">{book.totalSum.toLocaleString()} so'm</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-t border-slate-50 pt-2">
                     <p className="text-[10px] font-mono text-blue-600 font-bold">ISBN: {book.isbn}</p>
                     <p className="text-[10px] font-bold text-slate-400">{book.department}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-3xl text-white flex justify-between items-center mt-6">
            <div>
              <p className="text-[10px] text-slate-400 font-black uppercase">Jami Nusxalar</p>
              <p className="text-2xl font-black">{totalCopies} ta</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-400 font-black uppercase">Umumiy Summa</p>
              <p className="text-2xl font-black text-blue-400">{grandTotalSum.toLocaleString()} so'm</p>
            </div>
          </div>
          
          <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-widest pt-4">Tizim ID: {act.id.toUpperCase()}</p>
        </div>
      </div>
    </div>
  );
};

export default VerificationView;
