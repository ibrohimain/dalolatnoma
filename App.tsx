
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import ActList from './components/ActList';
import ActForm from './components/ActForm';
import ActPreview from './components/ActPreview';
import Dashboard from './components/Dashboard';
// import VerificationView from './components/VerificationView';
import { Dalolatnoma } from './types';
import { fetchDalolatnomalar, getActById } from './firebase';
import VerificationView from './components/components/VerificationView';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'stats'>('list');
  const [selectedAct, setSelectedAct] = useState<Dalolatnoma | null>(null);
  const [editingAct, setEditingAct] = useState<Dalolatnoma | null>(null);
  const [allActs, setAllActs] = useState<Dalolatnoma[]>([]);
  const [verifyingAct, setVerifyingAct] = useState<Dalolatnoma | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const loadAllActs = async () => {
    const data = await fetchDalolatnomalar();
    setAllActs(data as Dalolatnoma[]);
  };

  useEffect(() => {
    // Check for verification ID in URL
    const params = new URLSearchParams(window.location.search);
    const verifyId = params.get('verify');
    if (verifyId) {
      setIsVerifying(true);
      getActById(verifyId).then(act => {
        if (act) setVerifyingAct(act as Dalolatnoma);
      });
    }
    loadAllActs();
  }, [activeTab, selectedAct, editingAct]);

  const handleActSuccess = (act: Dalolatnoma) => {
    setSelectedAct(act);
    setEditingAct(null);
    loadAllActs();
  };

  const handleEdit = (act: Dalolatnoma) => {
    setEditingAct(act);
    setActiveTab('create');
  };

  const handleBack = () => {
    setSelectedAct(null);
    setEditingAct(null);
    setActiveTab('list');
  };

  // If in verification mode, show simplified view without navigation
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        {verifyingAct ? (
          <VerificationView act={verifyingAct} />
        ) : (
          <div className="text-center p-10 bg-white rounded-3xl shadow-xl border border-red-50">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h2 className="text-xl font-black text-slate-800 uppercase mb-2">Hujjat topilmadi</h2>
            <p className="text-sm text-slate-400 font-medium">Ushbu QR-kodga tegishli ma'lumot tizimda mavjud emas.</p>
          </div>
        )}
        <p className="mt-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">JizPI Axborot-Resurs Markazi</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-blue-800 text-white shadow-lg no-print">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-inner">
              <span className="text-blue-800 font-bold text-lg">PI</span>
            </div>
            <div>
              <h1 className="text-lg font-bold uppercase tracking-wider">JizPI ARM</h1>
              <p className="text-[10px] text-blue-100 opacity-80">Dalolatnoma Generator v2.0</p>
            </div>
          </div>
          <nav className="flex gap-2 bg-blue-900/40 p-1 rounded-lg border border-blue-700/50">
            <button onClick={() => { handleBack(); setActiveTab('list'); }} className={`px-4 py-1.5 rounded-md text-sm font-semibold transition ${activeTab === 'list' ? 'bg-white text-blue-800 shadow' : 'hover:bg-blue-700/50'}`}>Arxiv</button>
            <button onClick={() => { handleBack(); setActiveTab('stats'); }} className={`px-4 py-1.5 rounded-md text-sm font-semibold transition ${activeTab === 'stats' ? 'bg-white text-blue-800 shadow' : 'hover:bg-blue-700/50'}`}>Statistika</button>
            <button onClick={() => { handleBack(); setActiveTab('create'); }} className={`px-4 py-1.5 rounded-md text-sm font-semibold transition ${activeTab === 'create' ? 'bg-white text-blue-800 shadow' : 'hover:bg-blue-700/50'}`}>Yangi Act</button>
          </nav>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-8">
        {selectedAct ? (
          <ActPreview act={selectedAct} onBack={handleBack} />
        ) : activeTab === 'stats' ? (
          <Dashboard acts={allActs} />
        ) : activeTab === 'list' ? (
          <ActList onSelect={setSelectedAct} onEdit={handleEdit} />
        ) : (
          <ActForm onSuccess={handleActSuccess} initialData={editingAct} />
        )}
      </main>

      <footer className="bg-gray-100 border-t py-4 text-center text-gray-500 text-[10px] font-bold uppercase tracking-widest no-print">
        Jizzax Politexnika Instituti Axborot-Resurs Markazi &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default App;
