import React, { useState, useRef } from 'react';
import { useArisan } from '../context/ArisanContext';
import toast from 'react-hot-toast';

const Settings = () => {
  const { 
    billAmount, setBillAmount, 
    bankDetails, setBankDetails, 
    dueDate, setDueDate,
    nextArisanDate, setNextArisanDate,
    arisanTime, setArisanTime,
    adminPassword, setAdminPassword,
    appLogo, setAppLogo,
    resetArisan, resetPaymentStatus,
    exportData, importData,
    groups, activeGroupId, createGroup, switchGroup, deleteGroup, updateGroupName
  } = useArisan();

  const fileInputRef = useRef(null);
  const logoInputRef = useRef(null);
  
  const [newGroupName, setNewGroupName] = useState('');
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [editingGroupName, setEditingGroupName] = useState(false);
  const [tempGroupName, setTempGroupName] = useState('');

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

  const handleCreateGroup = (e) => {
    e.preventDefault();
    if (newGroupName.trim()) {
      createGroup(newGroupName);
      setNewGroupName('');
      setIsCreatingGroup(false);
      toast.success('Grup arisan baru berhasil dibuat!');
    }
  };

  const handleUpdateGroupName = (e) => {
    e.preventDefault();
    if (tempGroupName.trim()) {
      updateGroupName(tempGroupName);
      setEditingGroupName(false);
      toast.success('Nama grup berhasil diubah!');
    }
  };

  const handleDeleteGroup = (id, name) => {
    if (groups.length <= 1) {
        toast.error('Tidak bisa menghapus satu-satunya grup!');
        return;
    }
    if (window.confirm(`Yakin ingin menghapus grup "${name}"? Semua data di dalamnya akan hilang permanen.`)) {
        deleteGroup(id);
        toast.success('Grup berhasil dihapus');
    }
  };

  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 500000) { // Limit 500KB
        toast.error('Ukuran gambar maksimal 500KB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAppLogo(reader.result);
        toast.success('Logo berhasil diubah!');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
        <span>⚙️</span> Pengaturan
      </h2>

      {/* Group Management */}
      <div className="bg-blue-600 text-white p-4 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-4 border-b border-blue-500 pb-2">
            <h3 className="font-bold flex items-center gap-2">
                <span>📂</span> Kelola Grup Arisan
            </h3>
            <button 
                onClick={() => setIsCreatingGroup(!isCreatingGroup)}
                className="text-xs bg-white text-blue-600 px-3 py-1 rounded-full font-bold hover:bg-blue-50 transition"
            >
                {isCreatingGroup ? 'Batal' : '+ Buat Baru'}
            </button>
        </div>

        {isCreatingGroup && (
            <form onSubmit={handleCreateGroup} className="mb-4 bg-blue-700 p-3 rounded-lg animate-fade-in">
                <label className="text-xs text-blue-200 block mb-1">Nama Grup Baru</label>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                        placeholder="Misal: Arisan Kantor"
                        className="flex-1 text-gray-800 rounded px-3 py-1 text-sm focus:outline-none"
                        autoFocus
                    />
                    <button type="submit" className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded text-sm font-bold">
                        Simpan
                    </button>
                </div>
            </form>
        )}

        <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
            {groups.map(group => (
                <div 
                    key={group.id} 
                    className={`flex justify-between items-center p-3 rounded-lg border ${activeGroupId === group.id ? 'bg-white text-blue-700 border-white' : 'bg-blue-700 text-blue-100 border-blue-600 hover:bg-blue-500'}`}
                >
                    <div className="flex-1 cursor-pointer" onClick={() => switchGroup(group.id)}>
                        <div className="flex items-center gap-2">
                            {activeGroupId === group.id && <span>✅</span>}
                            <span className="font-bold text-sm truncate">{group.name}</span>
                        </div>
                        <div className="text-xs opacity-75 ml-6">
                            {group.members.length} Peserta
                        </div>
                    </div>
                    
                    {activeGroupId === group.id && (
                        <div className="flex gap-1 ml-2">
                            <button 
                                onClick={() => {
                                    setTempGroupName(group.name);
                                    setEditingGroupName(true);
                                }}
                                className="p-1 hover:bg-blue-50 rounded text-blue-600"
                                title="Ubah Nama"
                            >
                                ✏️
                            </button>
                        </div>
                    )}
                    
                    {groups.length > 1 && activeGroupId !== group.id && (
                         <button 
                            onClick={() => handleDeleteGroup(group.id, group.name)}
                            className="p-1 hover:bg-red-500 hover:text-white rounded text-red-300 transition"
                            title="Hapus Grup"
                        >
                            🗑️
                        </button>
                    )}
                </div>
            ))}
        </div>

        {editingGroupName && (
             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <form onSubmit={handleUpdateGroupName} className="bg-white p-4 rounded-lg shadow-xl w-full max-w-xs text-gray-800">
                    <h4 className="font-bold mb-2">Ubah Nama Grup</h4>
                    <input 
                        type="text" 
                        value={tempGroupName}
                        onChange={(e) => setTempGroupName(e.target.value)}
                        className="w-full border p-2 rounded mb-3 focus:outline-blue-500"
                    />
                    <div className="flex justify-end gap-2">
                        <button 
                            type="button" 
                            onClick={() => setEditingGroupName(false)}
                            className="px-3 py-1 text-gray-500 hover:bg-gray-100 rounded"
                        >
                            Batal
                        </button>
                        <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                            Simpan
                        </button>
                    </div>
                </form>
             </div>
        )}
      </div>

      {/* Logo Settings */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2 border-b pb-2">
          <span>🖼️</span> Logo Aplikasi
        </h3>
        <div className="flex flex-col items-center gap-4">
          <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 relative">
             {appLogo ? (
                <img src={appLogo} alt="Logo" className="w-full h-full object-cover" />
             ) : (
                <span className="text-4xl">🎰</span>
             )}
          </div>
          <div className="flex gap-2 w-full">
            <button 
                onClick={() => logoInputRef.current.click()}
                className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition border border-blue-100"
            >
                Upload Logo
            </button>
            {appLogo && (
                <button 
                    onClick={() => {
                        setAppLogo(null);
                        toast.success('Logo direset ke default');
                    }}
                    className="bg-red-50 text-red-600 px-4 rounded-lg text-sm font-medium hover:bg-red-100 transition border border-red-100"
                >
                    Hapus
                </button>
            )}
          </div>
          <input 
            type="file" 
            ref={logoInputRef}
            onChange={handleLogoChange}
            accept="image/*"
            className="hidden"
          />
          <p className="text-xs text-gray-400 text-center">
            Format: JPG/PNG. Maksimal 500KB.
          </p>
        </div>
      </div>

      {/* Info Arisan */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2 border-b pb-2">
          <span>📅</span> Info & Jadwal Arisan
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Jadwal Kocok</label>
                <input 
                  type="date" 
                  value={nextArisanDate}
                  onChange={(e) => setNextArisanDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Jam</label>
                <input 
                  type="time" 
                  value={arisanTime}
                  onChange={(e) => setArisanTime(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Batas Pembayaran</label>
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
