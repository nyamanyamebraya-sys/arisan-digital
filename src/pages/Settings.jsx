import React, { useState, useRef } from 'react';
import { useArisan } from '../context/ArisanContext';
import toast from 'react-hot-toast';

const Settings = () => {
  const { 
    billAmount, setBillAmount, 
    bankDetails, setBankDetails, 
    dueDate, setDueDate,
    adminPassword, setAdminPassword,
    resetArisan, resetPaymentStatus,
    exportData, importData
  } = useArisan();

  const fileInputRef = useRef(null);

  // Local state for password change
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (oldPass !== adminPassword) {
      toast.error('Password lama salah!');
      return;
    }
    if (newPass.length < 5) {
      toast.error('Password minimal 5 karakter!');
      return;
    }
    if (newPass !== confirmPass) {
      toast.error('Konfirmasi password tidak cocok!');
      return;
    }
    setAdminPassword(newPass);
    toast.success('Password admin berhasil diubah!');
    setOldPass('');
    setNewPass('');
    setConfirmPass('');
  };

  const handleDownload = () => {
    const dataStr = exportData();
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `arisan-backup-${new Date().toISOString().slice(0,10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    toast.success('Data berhasil didownload!');
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const fileReader = new FileReader();
    fileReader.readAsText(event.target.files[0], "UTF-8");
    fileReader.onload = (e) => {
      const success = importData(e.target.result);
      if (success) {
        toast.success('Data berhasil dipulihkan!');
      } else {
        toast.error('Format file salah!');
      }
    };
  };

  return (
    <div className="space-y-6 pb-20">
      <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
        <span>⚙️</span> Pengaturan
      </h2>

      {/* Info Arisan */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2 border-b pb-2">
          <span>📅</span> Info & Keuangan
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tanggal Jatuh Tempo</label>
            <input 
              type="text" 
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              placeholder="Contoh: Tanggal 10 Setiap Bulan"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nominal Iuran (Rp)</label>
            <input 
              type="number" 
              value={billAmount}
              onChange={(e) => setBillAmount(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Metode Pembayaran */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2 border-b pb-2">
          <span>💳</span> Rekening Transfer
        </h3>
        <div className="space-y-3">
          <input 
            type="text" 
            placeholder="Nama Bank (BCA/Mandiri/dll)"
            value={bankDetails.bankName}
            onChange={(e) => setBankDetails({...bankDetails, bankName: e.target.value})}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input 
            type="text" 
            placeholder="Nomor Rekening"
            value={bankDetails.accountNumber}
            onChange={(e) => setBankDetails({...bankDetails, accountNumber: e.target.value})}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input 
            type="text" 
            placeholder="Atas Nama"
            value={bankDetails.accountHolder}
            onChange={(e) => setBankDetails({...bankDetails, accountHolder: e.target.value})}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Manajemen Data */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2 border-b pb-2">
          <span>💾</span> Backup & Restore
        </h3>
        <div className="flex gap-3">
            <button 
                onClick={handleDownload}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-700 py-3 rounded-lg hover:bg-blue-100 transition font-medium text-sm border border-blue-100"
            >
                <span>⬇️</span> Download Data
            </button>
            <button 
                onClick={handleUploadClick}
                className="flex-1 flex items-center justify-center gap-2 bg-green-50 text-green-700 py-3 rounded-lg hover:bg-green-100 transition font-medium text-sm border border-green-100"
            >
                <span>⬆️</span> Restore Data
            </button>
            <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange} 
                accept=".json"
                style={{display: 'none'}} 
            />
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
            Gunakan fitur ini untuk memindahkan data ke HP lain.
        </p>
      </div>

      {/* Ganti Password */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2 border-b pb-2">
          <span>🔒</span> Ganti Password Admin
        </h3>
        <form onSubmit={handleChangePassword} className="space-y-3">
          <input 
            type="password" 
            placeholder="Password Lama"
            value={oldPass}
            onChange={(e) => setOldPass(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input 
            type="password" 
            placeholder="Password Baru"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input 
            type="password" 
            placeholder="Konfirmasi Password Baru"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            type="submit"
            className="w-full bg-gray-800 text-white py-2 rounded-lg font-bold hover:bg-gray-900 transition text-sm"
          >
            Update Password
          </button>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 p-4 rounded-xl shadow-sm border border-red-100">
        <h3 className="font-bold text-red-700 mb-4 flex items-center gap-2 border-b border-red-200 pb-2">
          <span>⚠️</span> Area Berbahaya
        </h3>
        <div className="space-y-3">
            <button 
                onClick={() => {
                    if(window.confirm('Yakin ingin mereset status pembayaran SEMUA peserta menjadi "Belum Bayar"?')) {
                        resetPaymentStatus();
                        toast.success('Status pembayaran direset!');
                    }
                }}
                className="w-full bg-white text-red-600 border border-red-200 py-3 rounded-lg font-medium hover:bg-red-100 transition text-sm flex items-center justify-center gap-2"
            >
                <span>🔄</span> Reset Pembayaran (Bulan Baru)
            </button>
            <button 
                onClick={() => {
                    if(window.confirm('PERINGATAN: Ini akan mereset status pemenang semua orang menjadi "Belum Menang". Data riwayat tetap tersimpan. Lanjutkan?')) {
                        resetArisan();
                        toast.success('Periode arisan direset!');
                    }
                }}
                className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition text-sm shadow-red-200 shadow-sm"
            >
                ☠️ Reset Periode Arisan (Mulai Ulang)
            </button>
        </div>
      </div>
      
      <div className="text-center text-xs text-gray-400 mt-8 pb-4">
        Arisan Digital v1.0.0
      </div>
    </div>
  );
};

export default Settings;
