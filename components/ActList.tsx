
import React, { useEffect, useState } from 'react';
import { Dalolatnoma } from '../types';
import { fetchDalolatnomalar, updateDalolatnoma, deleteDalolatnoma } from '../firebase';

interface ActListProps {
  onSelect: (act: Dalolatnoma) => void;
  onEdit: (act: Dalolatnoma) => void;
}

const ActList: React.FC<ActListProps> = ({ onSelect, onEdit }) => {
  const [acts, setActs] = useState<Dalolatnoma[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const loadActs = async () => {
    setLoading(true);
    try {
      const data = await fetchDalolatnomalar();
      setActs(data as Dalolatnoma[]);
    } catch (error) {
      console.error("Error loading acts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadActs(); }, []);

  const handleApprove = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Ushbu dalolatnomani tasdiqlaysizmi?")) {
      await updateDalolatnoma(id, { status: 'tasdiqlangan' });
      loadActs();
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Ushbu dalolatnomani o'chirib tashlaysizmi?")) {
      await deleteDalolatnoma(id);
      loadActs();
    }
  };

  const filteredActs = acts.filter(a => {
    const matchesFilter = filter === 'all' || a.status === filter || a.userType === filter;
    const matchesSearch = a.giverName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          a.actNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.giverFaculty.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-40">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-800 mb-4"></div>
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Ma'lumotlar yuklanmoqda...</p>
    </div>
  );

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
          {['all', 'yangi', 'tasdiqlangan', 'ichki', 'tashqi'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all border ${filter === f ? 'bg-blue-800 text-white border-blue-800 shadow-md' : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'}`}>
              {f === 'all' ? 'Hammasi' : f}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <input 
            type="text" 
            placeholder="Qidiruv..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
          <svg className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </div>

      {/* Compact List Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">№ / Sana</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Topshiruvchi</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Kitob (Nom/Soni)</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Holat</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredActs.map((act) => (
                <tr key={act.id} onClick={() => onSelect(act)} className="hover:bg-blue-50/30 transition-colors cursor-pointer group">
                  <td className="px-6 py-4">
                    <div className="font-black text-blue-900 text-sm">№ {act.actNumber}</div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase">{new Date(act.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-800 text-sm uppercase">{act.giverName}</div>
                    <div className="text-[11px] text-gray-400 truncate max-w-[200px]">{act.giverFaculty}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-[11px] font-bold text-gray-600">
                      <span>{act.books.reduce((sum, b) => sum + (b.titlesCount || 0), 0)} nom</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span>{act.books.reduce((sum, b) => sum + (b.copiesCount || 0), 0)} ta</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${act.status === 'tasdiqlangan' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700 animate-pulse'}`}>
                      {act.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {act.status === 'yangi' && (
                        <button onClick={(e) => handleApprove(e, act.id)} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all shadow-sm" title="Tasdiqlash">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                        </button>
                      )}
                      <button onClick={(e) => { e.stopPropagation(); onEdit(act); }} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm" title="Tahrirlash">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button onClick={(e) => handleDelete(e, act.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm" title="O'chirish">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredActs.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-gray-300 font-black uppercase tracking-widest text-xs">Ma'lumot topilmadi</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActList;
