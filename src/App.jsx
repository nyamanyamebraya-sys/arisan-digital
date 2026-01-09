import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { ArisanProvider, useArisan } from './context/ArisanContext';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import Lottery from './pages/Lottery';
import History from './pages/History';
import Login from './pages/Login';
import Settings from './pages/Settings';

function AppContent() {
  const { userRole, logout } = useArisan();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!userRole) {
    return <Login />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'members': return <Members />;
      case 'lottery': return <Lottery />;
      case 'history': return <History />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md sticky top-0 z-10 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-wide">Arisan Digital</h1>
        <div className="flex items-center gap-2">
            <span className="text-xs bg-blue-700 px-2 py-1 rounded">
                {userRole === 'admin' ? '🛡️ Admin' : '👤 Peserta'}
            </span>
            <button 
                onClick={logout}
                className="text-xs bg-red-500 hover:bg-red-600 px-2 py-1 rounded transition"
            >
                Keluar
            </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 overflow-y-auto pb-24 max-w-md mx-auto w-full">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-2 pb-4 shadow-lg z-10 max-w-md mx-auto">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center p-2 rounded-lg transition ${activeTab === 'dashboard' ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          <span className="text-xl mb-1">🏠</span>
          <span className="text-xs font-medium">Beranda</span>
        </button>
        <button 
          onClick={() => setActiveTab('members')}
          className={`flex flex-col items-center p-2 rounded-lg transition ${activeTab === 'members' ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-50'}`}
        >
            <span className="text-xl mb-1">👥</span>
          <span className="text-xs font-medium">Peserta</span>
        </button>
        <button 
          onClick={() => setActiveTab('lottery')}
          className={`flex flex-col items-center p-2 rounded-lg transition ${activeTab === 'lottery' ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-50'}`}
        >
            <span className="text-xl mb-1">🎲</span>
          <span className="text-xs font-medium">Kocok</span>
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center p-2 rounded-lg transition ${activeTab === 'history' ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-50'}`}
        >
            <span className="text-xl mb-1">📜</span>
          <span className="text-xs font-medium">Riwayat</span>
        </button>
        {userRole === 'admin' && (
        <button 
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center p-2 rounded-lg transition ${activeTab === 'settings' ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-50'}`}
        >
            <span className="text-xl mb-1">⚙️</span>
          <span className="text-xs font-medium">Pengaturan</span>
        </button>
        )}
      </nav>
    </div>
  );
}

function App() {
  return (
    <ArisanProvider>
      <Toaster position="top-center" />
      <AppContent />
    </ArisanProvider>
  );
}

export default App;
