
import React, { useEffect, useState } from 'react';
// import { Dalolatnoma } from '../types';
import { fetchDalolatnomaById } from '@/firebase';
import { Dalolatnoma } from '@/types';
// import { fetchDalolatnomaById } from '../firebase';

interface VerificationViewProps {
  actId: string;
  onClose: () => void;
}

const VerificationView: React.FC<VerificationViewProps> = ({ actId, onClose }) => {
  const [act, setAct] = useState<Dalolatnoma | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await fetchDalolatnomaById(actId);
      setAct(data as Dalolatnoma);
      setLoading(false);
    };
    load();
  }, [actId]);

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full mb-4"></div>
        <div className="h-4 w-32 bg-slate-200 rounded"></div>
      </div>
    </div>
  );

  if (!act) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl text-center max-w-md w-full border border-red-100">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </div>
        <h2 className="text-2xl font-black text-slate-800 uppercase mb-2">Hujjat topilmadi</h2>
        <p className="text-slate-400 text-sm mb-8 font-medium italic">Ushbu QR kod orqali bog'langan hujjat tizimda mavjud emas yoki o'chirib tashlangan.</p>
        <button onClick={onClose} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs">Asosiy sahifaga qaytish</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100/50 flex items-center justify-center p-6 font-sans">
      <div className="bg-white p-10 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] text-center max-w-lg w-full border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-green-500"></div>
        
        <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-green-100">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
        </div>

        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-2">Tasdiqlangan</h2>
        <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-700 px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-10">
          Elektron Imzolangan
        </div>

        <div className="space-y-6 text-left border-y border-slate-50 py-8 mb-8">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Hujjat raqami</p>
              <p className="font-bold text-slate-800">№ {act.actNumber}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Hujjat sanasi</p>
              <p className="font-bold text-slate-800">{new Date(act.date).toLocaleDateString()}</p>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Topshiruvchi</p>
            <p className="font-bold text-slate-800 uppercase">{act.giverName}</p>
            <p className="text-xs text-slate-400">{act.giverFaculty}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Jami nomda</p>
              <p className="font-bold text-slate-800">{act.books.reduce((sum, b) => sum + (b.titlesCount || 0), 0)} ta</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Jami summasi</p>
              <p className="font-bold text-blue-600">{act.books.reduce((sum, b) => sum + (b.totalSum || 0), 0).toLocaleString()} SO'M</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl mb-10">
           <p className="text-[9px] text-slate-400 font-bold uppercase mb-1">Hujjat ID</p>
           <p className="text-[10px] font-mono text-slate-500 break-all">{act.id}</p>
        </div>

        <p className="text-[11px] text-slate-400 italic mb-8 px-6">
          Ushbu hujjat JizPI Axborot-resurs markazi axborot tizimi orqali elektron shaklda shakllantirilgan va ushbu QR kod orqali haqiqiyligi tasdiqlangan.
        </p>

        <button onClick={onClose} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-colors shadow-xl shadow-slate-900/10">Tizimga kirish</button>
      </div>
    </div>
  );
};

export default VerificationView;
