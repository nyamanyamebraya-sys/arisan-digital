import React, { useState } from 'react';
import { useArisan } from '../context/ArisanContext';
import toast from 'react-hot-toast';

const Login = () => {
  const { login, adminPassword, appLogo } = useArisan();
  const [password, setPassword] = useState('');
  const [isAdminMode, setIsAdminMode] = useState(false);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (password === adminPassword) {
      login('admin');
      toast.success('Login Admin Berhasil!');
    } else {
      toast.error('Password Salah!');
    }
  };

  const handleGuestLogin = () => {
    login('guest');
    toast.success('Masuk sebagai Peserta');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm text-center">
        {appLogo ? (
            <img src={appLogo} alt="Logo Arisan" className="w-24 h-24 mx-auto mb-4 rounded-full object-cover border-4 border-blue-50" />
        ) : (
            <div className="text-5xl mb-4">🎰</div>
        )}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Arisan Digital</h1>
        <p className="text-gray-500 mb-8 text-sm">Kelola arisan dengan mudah dan transparan.</p>

        {isAdminMode ? (
          <form onSubmit={handleAdminLogin} className="space-y-4 animate-fade-in">
            <div className="text-left">
                <label className="text-xs font-bold text-gray-500 uppercase">Password Admin</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password..."
                    className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition"
            >
              Masuk
            </button>
            <button
              type="button"
              onClick={() => setIsAdminMode(false)}
              className="text-gray-400 text-sm hover:text-gray-600 underline"
            >
              Kembali
            </button>
          </form>
        ) : (
          <div className="space-y-3">
            <button
              onClick={handleGuestLogin}
              className="w-full bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600 transition shadow-lg shadow-green-200 flex items-center justify-center gap-2"
            >
              <span>👥</span> Masuk sebagai Peserta
            </button>
            
            <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-400">atau</span>
                </div>
            </div>

            <button
              onClick={() => setIsAdminMode(true)}
              className="w-full bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2"
            >
              <span>🛡️</span> Login Admin
            </button>
          </div>
        )}
        
        <div className="mt-8 text-xs text-gray-300">
            v1.0.0
        </div>
      </div>
    </div>
  );
};

export default Login;
