
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

  // Verification QR pointing to internal URL
  const verifyUrl = `${window.location.origin}${window.location.pathname}?verify=${act.id}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verifyUrl)}`;

  return (
    <div className="bg-white p-4 md:p-10 rounded-lg shadow-inner max-w-[210mm] mx-auto overflow-hidden border mb-10 animate-fade-in no-print-margin">
      {/* Action Bar */}
      <div className="flex justify-between items-center no-print mb-8 bg-slate-50 p-4 rounded-2xl border border-slate-200">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 font-bold hover:text-blue-800 transition text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Ro'yxatga qaytish
        </button>
        <button onClick={handlePrint} className="bg-slate-900 text-white px-8 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-slate-800 transition flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          Chop etish
        </button>
      </div>

      <div id="printable-act" className="text-black leading-tight font-serif text-[13px] print:text-[11px]">
        {/* Tasdiqlayman Section */}
        <div className="flex justify-end mb-6">
          <div className="text-center w-[280px]">
            <p className="font-bold uppercase text-[12px] mb-1">Tasdiqlayman</p>
            <p className="font-bold uppercase text-[9px] leading-tight mb-1">Jizzax politexnika instituti</p>
            <p className="font-bold uppercase text-[9px] leading-tight mb-1">axborot-resurs markazi direktori</p>
            <div className="mt-4 flex items-end justify-center">
               <span className="w-20 border-b border-black"></span>
               <p className="font-bold text-[14px] ml-2 leading-none">M.Ropiyeva</p>
            </div>
            <p className="font-bold text-[11px] pt-1 italic">
              {getApprovalDate()}
            </p>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-center text-[18px] font-bold tracking-[3px] mb-6 uppercase underline">
          D A L O L A T N O M A № {act.actNumber}
        </h2>

        {/* Intro Text */}
        <div className="mb-6 text-justify indent-10 leading-[1.6] text-[13px] print:text-[12px]">
          <p>
            Ushbu dalolatnoma {formatDate(act.date)} kuni “Axborot kutubxona resurslarini butlash, kataloglashtirish va tizimlashtirish” bo‘lim xodimlari <strong>{act.receiverEmployees}</strong> bilan Jizzax politexnika instituti «<strong>{act.giverFaculty}</strong>» {giverTypeLabel} <strong>{act.giverTitle}</strong> <strong>{act.giverName}</strong> tomonidan ARM fondiga {totalTitles} nomda {totalCopies} nusxada <strong>{act.actDescription}</strong> topshirilganligi to‘g‘risida tuzildi.
          </p>
        </div>

        {/* Location & Date */}
        <div className="flex justify-between mb-4 font-bold px-1 text-[12px] border-b border-black pb-1">
          <p>{formatDate(act.printDate)}</p>
          <p>Jizzax shahri</p>
        </div>

        {/* Main Table (8 columns as requested) */}
        <table className="w-full border-collapse border-[1.2px] border-black text-[10px] print:text-[9.5px] mb-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black p-1 w-6 text-center">№</th>
              <th className="border border-black p-1 text-left">Muallif, kitob nomi va turi</th>
              <th className="border border-black p-1 w-20 text-center">Bo'limi</th>
              <th className="border border-black p-1 w-10 text-center">Nomda</th>
              <th className="border border-black p-1 w-12 text-center">Nusxada</th>
              <th className="border border-black p-1 w-10 text-center">Beti</th>
              <th className="border border-black p-1 w-20 text-center">Summasi (so'm)</th>
              <th className="border border-black p-1 w-22 text-center">Jami summasi (so'm)</th>
            </tr>
          </thead>
          <tbody>
            {act.books.map((book, index) => (
              <tr key={index}>
                <td className="border border-black p-1 text-center font-bold">{index + 1}</td>
                <td className="border border-black p-1 leading-tight">{book.author} "{book.title}", {book.bookCategory}</td>
                <td className="border border-black p-1 text-center">{book.department}</td>
                <td className="border border-black p-1 text-center">{book.titlesCount}</td>
                <td className="border border-black p-1 text-center">{book.copiesCount}</td>
                <td className="border border-black p-1 text-center">{book.pages}</td>
                <td className="border border-black p-1 text-center">{book.pricePerCopy.toLocaleString()}</td>
                <td className="border border-black p-1 text-center font-bold">{book.totalSum.toLocaleString()}</td>
              </tr>
            ))}
            <tr className="font-bold bg-gray-50">
              <td colSpan={3} className="border border-black p-1.5 text-right uppercase tracking-wider text-[9px]">Jami:</td>
              <td className="border border-black p-1.5 text-center">{totalTitles}</td>
              <td className="border border-black p-1.5 text-center">{totalCopies}</td>
              <td className="border border-black p-1.5 text-center">-</td>
              <td className="border border-black p-1.5 text-center">-</td>
              <td className="border border-black p-1.5 text-center">{grandTotalSum.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>

        {/* Signatures */}
        <div className="mt-10 space-y-10">
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
              <p className="text-[8px] italic text-gray-400 mb-1">(imzo)</p>
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
              <p className="text-[8px] italic text-gray-400 mb-1">(imzo)</p>
              <p className="text-[12px] font-bold uppercase">{act.giverName || '________________'}</p>
            </div>
          </div>
        </div>

        {/* Electronic Signature QR & Verification Section */}
        <div className="mt-12 flex flex-col items-center justify-center border-t border-dashed border-gray-300 pt-6">
           <div className="flex items-center gap-6">
              <div className="text-right">
                 <p className="text-[11px] font-black text-blue-900 uppercase tracking-widest leading-none mb-1">Elektron tasdiqlangan</p>
                 <p className="text-[9px] text-gray-500 font-bold uppercase leading-none">JizPI ARM Axborot Tizimi orqali</p>
                 <p className="text-[8px] text-gray-400 mt-2 font-mono italic">Haqiqiylikni tekshirish uchun skanerlang</p>
              </div>
              <img src={qrUrl} alt="QR Verification" className="w-20 h-20 border p-1 bg-white shadow-sm" />
           </div>
           <p className="text-[8px] text-gray-400 italic mt-4 text-center">Ushbu hujjat elektron shaklda shakllantirilgan va tizimda qayd etilgan.</p>
        </div>
      </div>
    </div>
  );
};

export default ActPreview;
