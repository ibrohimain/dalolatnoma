
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'list' | 'create';
  setActiveTab: (tab: 'list' | 'create') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-blue-800 text-white shadow-lg no-print">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <span className="text-blue-800 font-bold text-xl">PI</span>
            </div>
            <div>
              <h1 className="text-xl font-bold uppercase tracking-wider">JizPI ARM</h1>
              <p className="text-xs text-blue-100">Axborot-resurs markazi Dalolatnoma Tizimi</p>
            </div>
          </div>
          <nav className="flex gap-2 bg-blue-900/50 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-4 py-2 rounded-md transition-all ${activeTab === 'list' ? 'bg-white text-blue-800 font-semibold shadow' : 'hover:bg-blue-700'}`}
            >
              Arxiv
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`px-4 py-2 rounded-md transition-all ${activeTab === 'create' ? 'bg-white text-blue-800 font-semibold shadow' : 'hover:bg-blue-700'}`}
            >
              Yangi Dalolatnoma
            </button>
          </nav>
        </div>
      </header>
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-8">
        {children}
      </main>
      <footer className="bg-gray-100 border-t py-4 text-center text-gray-500 text-sm no-print">
        &copy; {new Date().getFullYear()} Jizzax Politexnika Instituti Axborot-Resurs Markazi
      </footer>
    </div>
  );
};

export default Layout;
