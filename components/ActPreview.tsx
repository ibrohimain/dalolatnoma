
import React from 'react';
import { Dalolatnoma } from '../types';

interface ActPreviewProps {
  act: Dalolatnoma;
  onBack?: () => void;
}

const ActPreview: React.FC<ActPreviewProps> = ({ act, onBack }) => {
  const months = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'];
  
  const handlePrint = () => { window.print(); };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '__.__.____';
    const d = new Date(dateStr);
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}-yil`;
  };

  const getApprovalDate = () => {
    const d = new Date();
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}-yil`;
  };

  const totalTitles = act.books.reduce((acc, b) => acc + (b.titlesCount || 0), 0);
  const totalCopies = act.books.reduce((acc, b) => acc + (b.copiesCount || 0), 0);
  const grandTotalSum = act.books.reduce((acc, b) => acc + (b.totalSum || 0), 0);

  const giverTypeLabel = act.userType === 'ichki' ? 'kafedrasi' : 'tashkiloti/vakili';

  // Verification QR data including ISBNs and key details for authentication
  const bookDetails = act.books.map(b => `${b.title} (ISBN:${b.isbn})`).join(', ');
  const qrData = `JizPI-ARM-AUTH: ACT:${act.actNumber} | DATE:${act.date} | GIVER:${act.giverName} | TOTAL:${grandTotalSum} | BOOKS:${bookDetails}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;

  return (
    <div className="bg-white p-4 md:p-12 rounded-lg shadow-inner max-w-[210mm] mx-auto overflow-hidden border mb-10 animate-fade-in no-print-margin">
      {/* Action Bar - "Back" button removed as requested */}
      <div className="flex justify-end items-center no-print mb-8 bg-slate-50 p-4 rounded-2xl border border-slate-200">
        <button onClick={handlePrint} className="bg-slate-900 text-white px-10 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-slate-800 transition flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          Chop etish
        </button>
      </div>

      <div id="printable-act" className="text-black leading-tight font-serif text-[12px] print:text-[11.5px]">
        {/* Tasdiqlayman Section */}
        <div className="flex justify-end mb-6">
          <div className="text-center w-[280px]">
            <p className="font-bold uppercase text-[12px] mb-1">Tasdiqlayman</p>
            <p className="font-bold uppercase text-[9px] leading-tight mb-1">Jizzax politexnika instituti</p>
            <p className="font-bold uppercase text-[9px] leading-tight mb-1">axborot-resurs markazi direktori</p>
            <div className="mt-6 flex items-end justify-center">
               <span className="w-20 border-b border-black"></span>
               <p className="font-bold text-[14px] ml-2 leading-none">M.Ropiyeva</p>
            </div>
            <p className="font-bold text-[11px] pt-1 italic">
              {getApprovalDate()}
            </p>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-center text-[18px] font-bold tracking-[3px] mb-8 uppercase underline">
          D A L O L A T N O M A № {act.actNumber}
        </h2>

        {/* Intro Text */}
        <div className="mb-6 text-justify indent-10 leading-[1.6] text-[13px]">
          <p>
            Ushbu dalolatnoma {formatDate(act.date)} kuni “Axborot kutubxona resurslarini butlash, kataloglashtirish va tizimlashtirish” bo‘lim xodimlari <strong>{act.receiverEmployees}</strong> bilan Jizzax politexnika instituti «<strong>{act.giverFaculty}</strong>» {giverTypeLabel} <strong>{act.giverTitle}</strong> <strong>{act.giverName}</strong> tomonidan ARM fondiga {totalTitles} nomda {totalCopies} nusxada <strong>{act.actDescription}</strong> topshirilganligi to‘g‘risida tuzildi.
          </p>
        </div>

        {/* Location & Date */}
        <div className="flex justify-between mb-4 font-bold px-1 text-[12px] border-b border-black pb-1">
          <p>{formatDate(act.printDate)}</p>
          <p>Jizzax shahri</p>
        </div>

        {/* Table including ISBN, Pages, and split counts */}
        <table className="w-full border-collapse border-[1.2px] border-black text-[9.5px] print:text-[9px] mb-8">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black p-1 w-6 text-center">№</th>
              <th className="border border-black p-1 text-left">Muallif, kitob nomi va turi</th>
              <th className="border border-black p-1 w-24 text-center">ISBN</th>
              <th className="border border-black p-1 w-16 text-center">Bo'limi</th>
              <th className="border border-black p-1 w-8 text-center">Nomda</th>
              <th className="border border-black p-1 w-8 text-center">Sonda</th>
              <th className="border border-black p-1 w-8 text-center">Beti</th>
              <th className="border border-black p-1 w-18 text-center">Summasi (so'm)</th>
              <th className="border border-black p-1 w-22 text-center">Jami summasi (so'm)</th>
            </tr>
          </thead>
          <tbody>
            {act.books.map((book, index) => (
              <tr key={index}>
                <td className="border border-black p-1 text-center font-bold">{index + 1}</td>
                <td className="border border-black p-1 leading-tight">{book.author} "{book.title}", {book.bookCategory}</td>
                <td className="border border-black p-1 text-center font-mono">{book.isbn}</td>
                <td className="border border-black p-1 text-center">{book.department}</td>
                <td className="border border-black p-1 text-center">{book.titlesCount}</td>
                <td className="border border-black p-1 text-center">{book.copiesCount}</td>
                <td className="border border-black p-1 text-center">{book.pages}</td>
                <td className="border border-black p-1 text-center">{book.pricePerCopy.toLocaleString()}</td>
                <td className="border border-black p-1 text-center font-bold">{book.totalSum.toLocaleString()}</td>
              </tr>
            ))}
            <tr className="font-bold bg-gray-50">
              <td colSpan={4} className="border border-black p-2 text-right uppercase tracking-wider text-[9px]">Jami:</td>
              <td className="border border-black p-2 text-center">{totalTitles}</td>
              <td className="border border-black p-2 text-center">{totalCopies}</td>
              <td className="border border-black p-2 text-center">-</td>
              <td className="border border-black p-2 text-center">-</td>
              <td className="border border-black p-2 text-center">{grandTotalSum.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>

        {/* Signatures */}
        <div className="mt-12 space-y-12">
          <div className="flex justify-between items-start">
            <div className="w-1/2">
              <p className="font-bold underline mb-2 uppercase text-[10px]">Qabul qildi:</p>
              <p className="text-[10px] font-bold leading-tight uppercase">
                Axborot kutubxona resurslarini <br />
                butlash, kataloglashtirish va <br />
                tizimlashtirish bo‘lim boshlig‘i:
              </p>
            </div>
            <div className="w-1/2 text-center">
              <p className="mb-1 font-bold">______________________</p>
              <p className="text-[8px] italic text-gray-500 mb-1">(imzo)</p>
              <p className="text-[12px] font-bold uppercase">M.Ortiqova</p>
            </div>
          </div>

          <div className="flex justify-between items-start">
            <div className="w-1/2">
              <p className="font-bold underline mb-2 uppercase text-[10px]">Topshirdi:</p>
              <p className="text-[10px] font-bold leading-tight uppercase">
                «{act.giverFaculty}» {giverTypeLabel} <br />
                {act.giverTitle} :
              </p>
            </div>
            <div className="w-1/2 text-center">
              <p className="mb-1 font-bold">______________________</p>
              <p className="text-[8px] italic text-gray-500 mb-1">(imzo)</p>
              <p className="text-[12px] font-bold uppercase">{act.giverName || '________________'}</p>
            </div>
          </div>
        </div>

        {/* Electronic Signature QR & Verification Section (Refined) */}
        <div className="mt-14 flex flex-col items-center justify-center border-t border-dashed border-gray-300 pt-8">
           <div className="flex items-center gap-10">
              <div className="text-right">
                 <p className="text-[11px] font-black text-blue-900 uppercase tracking-widest leading-none mb-1">Elektron tasdiqlangan</p>
                 <p className="text-[9px] text-gray-500 font-bold uppercase leading-none">JizPI ARM Tizimi</p>
                 <p className="text-[8px] text-gray-400 mt-3 font-mono">Hujjat ID: {act.id.substring(0,10).toUpperCase()}</p>
              </div>
              <div className="p-2 border border-slate-200 bg-white rounded-xl shadow-sm">
                <img src={qrUrl} alt="QR Verification" className="w-24 h-24" />
              </div>
           </div>
           <p className="text-[8px] text-gray-400 italic mt-6 text-center max-w-sm">Ushbu hujjat JizPI ARM tizimi orqali elektron shakllantirilgan. QR-kod orqali barcha ISBN ma'lumotlarini tekshirish mumkin.</p>
        </div>
      </div>
    </div>
  );
};

export default ActPreview;
