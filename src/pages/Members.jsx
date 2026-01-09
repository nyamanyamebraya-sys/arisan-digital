import React, { useState } from 'react';
import { useArisan } from '../context/ArisanContext';
import toast from 'react-hot-toast';

const Members = () => {
  const { members, addMember, updateMember, removeMember, billAmount, setBillAmount, userRole, bankDetails } = useArisan();
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  
  // Edit State
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');

  const isAdmin = userRole === 'admin';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    if (newName.trim()) {
      addMember(newName.trim(), newPhone.trim());
      setNewName('');
      setNewPhone('');
      toast.success('Peserta berhasil ditambahkan!');
    }
  };

  const startEdit = (member) => {
    setEditingId(member.id);
    setEditName(member.name);
    setEditPhone(member.phone || '');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditPhone('');
  };

  const saveEdit = (id) => {
    if (editName.trim()) {
      updateMember(id, { name: editName.trim(), phone: editPhone.trim() });
      setEditingId(null);
      toast.success('Data peserta diperbarui!');
    }
  };

  const togglePaid = (id, currentStatus) => {
    if (!isAdmin) return;
    updateMember(id, { hasPaid: !currentStatus });
    if (!currentStatus) {
        toast.success('Pembayaran dicatat!');
    }
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
  };

  const getWaLink = (member) => {
    if (!member.phone) return '#';
    
    // Normalize phone number (remove 0, add 62)
    let phone = member.phone.replace(/\D/g, '');
    if (phone.startsWith('0')) {
      phone = '62' + phone.substring(1);
    }
    
    let message = `Halo ${member.name}, ini pengingat untuk pembayaran arisan sebesar ${formatRupiah(billAmount)}. Mohon segera dibayar ya.`;
    
    if (bankDetails.bankName && bankDetails.accountNumber) {
        message += `\n\nTransfer ke: ${bankDetails.bankName} - ${bankDetails.accountNumber} (a.n ${bankDetails.accountHolder})`;
    }
    
    message += `\n\nTerima kasih! 🙏`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  const [showBroadcast, setShowBroadcast] = useState(false);
  const [autoBlastIndex, setAutoBlastIndex] = useState(null); // Index of current member being blasted

  const getUnpaidMembers = () => members.filter(m => !m.hasPaid);
  const unpaidMembers = getUnpaidMembers();

  const startAutoBlast = () => {
    if (unpaidMembers.length > 0) {
        setAutoBlastIndex(0);
    } else {
        toast.success("Semua peserta sudah bayar! 🎉");
    }
  };

  const handleNextBlast = () => {
    if (autoBlastIndex < unpaidMembers.length - 1) {
        setAutoBlastIndex(prev => prev + 1);
    } else {
        setAutoBlastIndex(null); // Finish
        toast.success("Selesai! Semua tagihan telah diproses.");
    }
  };

  const currentBlastMember = autoBlastIndex !== null ? unpaidMembers[autoBlastIndex] : null;

  const generateGroupMessage = () => {
    const unpaid = getUnpaidMembers();
    if (unpaid.length === 0) return '';
    
    let message = `🔔 *PENGINGAT ARISAN* 🔔\n\n`;
    message += `Halo semuanya, berikut daftar peserta yang belum melunasi arisan (Rp ${formatRupiah(billAmount)}):\n\n`;
    
    unpaid.forEach((m, index) => {
      message += `${index + 1}. ${m.name}\n`;
    });
    
    message += `\nMohon segera melakukan pembayaran ya.`;
    
    if (bankDetails.bankName && bankDetails.accountNumber) {
        message += `\n\n💳 *Rekening Transfer:*\n${bankDetails.bankName}\n${bankDetails.accountNumber}\na.n ${bankDetails.accountHolder}`;
    }
    
    message += `\n\nTerima kasih! 🙏`;
    return message;
  };

  const copyGroupMessage = () => {
    const message = generateGroupMessage();
    navigator.clipboard.writeText(message);
    toast.success('Pesan grup disalin!');
  };

  const sendGroupMessage = () => {
    const message = generateGroupMessage();
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleMarkPaidAndNext = () => {
    if (currentBlastMember) {
        togglePaid(currentBlastMember.id, false); // false means currentStatus is not paid, so it will mark as paid
        // Small delay to let user see feedback before moving
        setTimeout(() => {
             handleNextBlast();
        }, 500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Broadcast Button - Only for Admin */}
      {isAdmin && (
      <div className="flex justify-between items-center">
          <div className="flex gap-3">
            <button 
                onClick={() => setShowBroadcast(true)}
                className="text-sm text-green-600 font-medium flex items-center gap-1 bg-green-50 px-2 rounded-lg border border-green-100"
            >
                📢 Broadcast Tagihan
            </button>
          </div>
          <span className="text-sm text-gray-500">
             Tagihan: <span className="font-bold text-gray-800">{formatRupiah(billAmount)}</span>
          </span>
      </div>
      )}

      {/* Broadcast Modal - Only render if isAdmin */}
      {isAdmin && showBroadcast && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
            {/* ... Modal content same ... */}
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="p-4 border-b flex justify-between items-center bg-green-50 rounded-t-xl">
                    <h3 className="font-bold text-green-800 flex items-center gap-2">📢 Broadcast Tagihan</h3>
                    <button onClick={() => setShowBroadcast(false)} className="text-gray-500 hover:text-gray-800">✕</button>
                </div>
                
                <div className="p-4 space-y-6">
                    {/* Group Message Section */}
                    <div>
                        <h4 className="font-bold text-gray-700 mb-2">1. Kirim ke Grup WA</h4>
                        <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-600 whitespace-pre-wrap border border-gray-200 mb-3 max-h-32 overflow-y-auto">
                            {generateGroupMessage() || 'Semua peserta sudah lunas! 🎉'}
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={copyGroupMessage}
                                disabled={getUnpaidMembers().length === 0}
                                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition disabled:opacity-50"
                            >
                                📋 Copy Teks
                            </button>
                            <button 
                                onClick={sendGroupMessage}
                                disabled={getUnpaidMembers().length === 0}
                                className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-1"
                            >
                                🚀 Kirim ke Grup
                            </button>
                        </div>
                    </div>

                    {/* Personal Blast Section */}
                    <div>
                        <div className="flex justify-between items-end mb-2">
                             <h4 className="font-bold text-gray-700">2. Auto Blast (Personal)</h4>
                             <button 
                                onClick={startAutoBlast}
                                disabled={unpaidMembers.length === 0}
                                className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition shadow-sm disabled:bg-gray-300"
                             >
                                 ⚡ Mulai Kirim Otomatis
                             </button>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">Atau kirim manual satu per satu di bawah ini:</p>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {unpaidMembers.length > 0 ? (
                                unpaidMembers.map((m) => (
                                    <div key={m.id} className="flex justify-between items-center bg-white border p-2 rounded-lg">
                                        <span className="font-medium text-sm">{m.name}</span>
                                        {m.phone ? (
                                            <a 
                                                href={getWaLink(m)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-green-100 text-green-700 px-3 py-1 rounded text-xs font-medium hover:bg-green-200 transition"
                                            >
                                                Kirim WA ➤
                                            </a>
                                        ) : (
                                            <span className="text-xs text-gray-400">No WA Tidak Ada</span>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-400 text-sm py-4">Tidak ada tagihan tertunggak.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Auto Blast Modal Overlay */}
      {autoBlastIndex !== null && currentBlastMember && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[60] p-4 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden relative">
                <div className="bg-blue-600 p-6 text-white text-center">
                    <h3 className="text-xl font-bold mb-1">⚡ Auto Blast Mode</h3>
                    <p className="text-blue-100 text-sm">Mengirim {autoBlastIndex + 1} dari {unpaidMembers.length}</p>
                </div>
                
                <div className="p-6 text-center space-y-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto flex items-center justify-center text-3xl font-bold text-gray-600">
                        {currentBlastMember.name.charAt(0).toUpperCase()}
                    </div>
                    
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">{currentBlastMember.name}</h2>
                        <p className="text-gray-500 text-sm">{currentBlastMember.phone || 'No WA Tidak Ada'}</p>
                        <div className="mt-2 inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">
                            Belum Bayar: {formatRupiah(billAmount)}
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 mt-6">
                        {currentBlastMember.phone ? (
                            <a 
                                href={getWaLink(currentBlastMember)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600 transition shadow-lg flex items-center justify-center gap-2"
                            >
                                <span>📱</span> Buka WhatsApp
                            </a>
                        ) : (
                            <div className="p-3 bg-gray-100 text-gray-500 rounded-lg text-sm">
                                Nomor WhatsApp tidak tersedia
                            </div>
                        )}
                        
                        <div className="grid grid-cols-2 gap-2">
                             <button 
                                onClick={handleMarkPaidAndNext}
                                className="bg-blue-100 text-blue-700 py-3 rounded-xl font-bold hover:bg-blue-200 transition"
                            >
                                ✅ Sudah Bayar
                            </button>
                             <button 
                                onClick={handleNextBlast}
                                className="bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200 transition"
                            >
                                Lewati ➤
                            </button>
                        </div>
                        <button 
                            onClick={() => setAutoBlastIndex(null)}
                            className="w-full py-2 text-gray-400 hover:text-gray-600 font-medium text-sm"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Add Member Form - Only for Admin */}
      {isAdmin && (
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-sm space-y-3 sticky top-0 z-0">
        <div className="flex gap-3">
            <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nama Peserta..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            />
            <input
            type="tel"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
            placeholder="No. WA (08xx)..."
            className="w-1/3 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            />
        </div>
        <button 
          type="submit"
          disabled={!newName.trim()}
          className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          Tambah Peserta
        </button>
      </form>
      )}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h2 className="font-bold text-gray-700">Daftar Peserta</h2>
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">{members.length} Orang</span>
        </div>
        
        {members.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {members.map((member) => (
              <li key={member.id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition">
                <div className="flex items-center gap-4 flex-1">
                  <div 
                    onClick={() => togglePaid(member.id, member.hasPaid)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm transition ${isAdmin ? 'cursor-pointer hover:scale-110' : ''} ${member.hasWon ? 'bg-green-500' : member.hasPaid ? 'bg-blue-500' : 'bg-gray-400'}`}
                    title={member.hasWon ? 'Sudah Menang' : member.hasPaid ? 'Sudah Bayar (Klik untuk batal)' : 'Belum Bayar (Klik untuk bayar)'}
                  >
                    {member.hasWon ? '👑' : member.hasPaid ? '💰' : member.name.charAt(0).toUpperCase()}
                  </div>
                  
                  {isAdmin && editingId === member.id ? (
                    <div className="flex-1 flex gap-2">
                        <input 
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                            placeholder="Nama"
                        />
                        <input 
                            value={editPhone}
                            onChange={(e) => setEditPhone(e.target.value)}
                            className="w-24 border border-gray-300 rounded px-2 py-1 text-sm"
                            placeholder="No WA"
                        />
                         <button onClick={() => saveEdit(member.id)} className="text-green-600 bg-green-50 p-1 rounded">✔️</button>
                         <button onClick={cancelEdit} className="text-red-600 bg-red-50 p-1 rounded">❌</button>
                    </div>
                  ) : (
                    <div>
                        <p className="font-medium text-gray-800 text-lg flex items-center gap-2">
                            {member.name}
                            {member.hasPaid && !member.hasWon && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Lunas</span>}
                        </p>
                        <div className="flex items-center gap-2">
                            <p className={`text-xs font-medium ${member.hasWon ? 'text-green-600' : 'text-gray-400'}`}>
                                {member.hasWon ? '✓ Sudah Menang' : '• Belum Menang'}
                            </p>
                            {member.phone && <span className="text-xs text-gray-400">| {member.phone}</span>}
                        </div>
                    </div>
                  )}
                </div>
                
                {/* Admin Actions */}
                {isAdmin && (
                <div className="flex items-center gap-2">
                    {editingId !== member.id && (
                        <>
                            {/* Explicit Payment Button */}
                            {isAdmin && !member.hasWon && (
                                <button
                                    onClick={() => togglePaid(member.id, member.hasPaid)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm mr-1 ${
                                        member.hasPaid 
                                        ? 'bg-gray-100 text-gray-500 hover:bg-gray-200 border border-gray-200' 
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                                >
                                    {member.hasPaid ? '❌ Batal' : '✅ Bayar'}
                                </button>
                            )}

                            <button 
                                onClick={() => startEdit(member)}
                                className="text-gray-400 hover:text-blue-500 p-2 transition rounded-full hover:bg-blue-50"
                                title="Edit Peserta"
                            >
                                ✏️
                            </button>
                            {member.phone && !member.hasPaid && (
                                <a 
                                    href={getWaLink(member)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition shadow-sm"
                                    title="Kirim Tagihan WA"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.463 1.065 2.876 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                                </a>
                            )}
                            <button 
                                onClick={() => {
                                    if(window.confirm(`Hapus peserta "${member.name}"?`)) {
                                        removeMember(member.id);
                                        toast.success('Peserta dihapus');
                                    }
                                }}
                                className="text-gray-400 hover:text-red-500 p-2 transition rounded-full hover:bg-red-50"
                                aria-label="Hapus"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </>
                    )}
                </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-12 px-4 text-center">
            <div className="text-gray-300 text-5xl mb-4">👥</div>
            <p className="text-gray-500 font-medium">Belum ada peserta</p>
            <p className="text-gray-400 text-sm mt-1">Tambahkan peserta baru pada kolom di atas</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Members;
