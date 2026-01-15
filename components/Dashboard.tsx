
import React, { useState } from 'react';
import { Dalolatnoma } from '../types';

interface DashboardProps {
  acts: Dalolatnoma[];
}

const Dashboard: React.FC<DashboardProps> = ({ acts }) => {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'year' | 'all'>('all');

  const filterByTime = (act: Dalolatnoma) => {
    const actDate = new Date(act.date);
    const now = new Date();
    
    if (timeRange === 'day') {
      return actDate.toDateString() === now.toDateString();
    }
    if (timeRange === 'week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7);
      return actDate >= oneWeekAgo;
    }
    if (timeRange === 'month') {
      return actDate.getMonth() === now.getMonth() && actDate.getFullYear() === now.getFullYear();
    }
    if (timeRange === 'year') {
      return actDate.getFullYear() === now.getFullYear();
    }
    return true;
  };

  const filteredActs = acts.filter(filterByTime);

  const stats = {
    totalActs: filteredActs.length,
    totalBooks: filteredActs.reduce((acc, a) => acc + a.books.reduce((sum, b) => sum + (b.titlesCount || 0), 0), 0),
    totalCopies: filteredActs.reduce((acc, a) => acc + a.books.reduce((sum, b) => sum + (b.copiesCount || 0), 0), 0),
    ichkiCount: filteredActs.filter(a => a.userType === 'ichki').length,
    tashqiCount: filteredActs.filter(a => a.userType === 'tashqi').length,
    approvedCount: filteredActs.filter(a => a.status === 'tasdiqlangan').length,
  };

  const handleExport = () => {
    const headers = ["№", "Sana", "Foydalanuvchi", "Turi", "Kafedra/Tashkilot", "Nomda", "Sonda", "Holati"];
    const rows = filteredActs.map(a => [
      a.actNumber,
      a.date,
      a.giverName,
      a.userType === 'ichki' ? 'Ichki' : 'Tashqi',
      `"${a.giverFaculty}"`,
      a.books.reduce((acc, b) => acc + b.titlesCount, 0),
      a.books.reduce((acc, b) => acc + b.copiesCount, 0),
      a.status
    ]);
    
    const csvContent = "\uFEFF" + [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `hisobot_${timeRange}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 gap-4">
        <div className="flex flex-wrap gap-2">
          {(['day', 'week', 'month', 'year', 'all'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                timeRange === range 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {range === 'day' ? 'Bugun' : range === 'week' ? 'Hafta' : range === 'month' ? 'Oy' : range === 'year' ? 'Yil' : 'Hammasi'}
            </button>
          ))}
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 shadow-md transition-all active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Hisobotni yuklab olish
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Hujjatlar', val: stats.totalActs, color: 'blue', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
          { label: 'Kitob Nomlari', val: stats.totalBooks, color: 'indigo', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
          { label: 'Kitob Nusxalari', val: stats.totalCopies, color: 'purple', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
          { label: 'Tasdiqlanganlar', val: stats.approvedCount, color: 'green', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
        ].map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 group hover:border-blue-200 transition-colors">
            <div className={`p-3 rounded-xl bg-${s.color}-50 text-${s.color}-600`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={s.icon} /></svg>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{s.label}</p>
              <p className="text-2xl font-black text-gray-800">{s.val}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
            Foydalanuvchilar Tahlili
          </h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Ichki (Kafedralar)</span>
                <span className="font-bold">{stats.ichkiCount} ta ({Math.round((stats.ichkiCount / (stats.totalActs || 1)) * 100)}%)</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: `${(stats.ichkiCount / (stats.totalActs || 1)) * 100}%` }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Tashqi (Homiylar)</span>
                <span className="font-bold">{stats.tashqiCount} ta ({Math.round((stats.tashqiCount / (stats.totalActs || 1)) * 100)}%)</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full transition-all duration-1000" style={{ width: `${(stats.tashqiCount / (stats.totalActs || 1)) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <div className="text-center">
            <p className="text-sm text-gray-400 uppercase font-bold tracking-widest mb-2">Tanlangan davr bo'yicha</p>
            <h4 className="text-5xl font-black text-gray-900 mb-2">{stats.totalCopies}</h4>
            <p className="text-gray-500 font-medium">Jami qabul qilingan kitoblar nusxasi</p>
          </div>
          <div className="mt-8 flex justify-center gap-8">
             <div className="text-center">
               <p className="text-2xl font-bold text-blue-600">{stats.totalBooks}</p>
               <p className="text-xs text-gray-400 font-bold uppercase">Nomlar</p>
             </div>
             <div className="w-px h-10 bg-gray-100"></div>
             <div className="text-center">
               <p className="text-2xl font-bold text-green-600">{stats.approvedCount}</p>
               <p className="text-xs text-gray-400 font-bold uppercase">Tasdiqlangan</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
