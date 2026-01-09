import React, { useRef, useState } from 'react';
import { useArisan } from '../context/ArisanContext';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { 
    members, history, billAmount, 
    bankDetails, dueDate, nextArisanDate, arisanTime 
  } = useArisan();
  
  const isAdmin = false; // Not used here directly as role is handled in App.jsx but good for future
  const totalMembers = members.length;
  
  const hasWonCount = members.filter(m => m.hasWon).length;
  const remainingCount = totalMembers - hasWonCount;
  
  const paidCount = members.filter(m => m.hasPaid).length;
  const totalCollected = paidCount * billAmount;
  const totalPot = totalMembers * billAmount;
  const progressPercent = totalMembers > 0 ? (paidCount / totalMembers) * 100 : 0;

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
  };
  
  const formatDate = (dateString) => {
      if (!dateString) return '-';
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <div className="space-y-4">
      {/* Header Info */}
      <div className="flex justify-between items-center mb-2">
         <div>
             <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
             {dueDate && <p className="text-xs text-red-500 font-medium">Jatuh Tempo: {dueDate}</p>}
         </div>
      </div>

      {/* Next Schedule Card */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 rounded-lg shadow-md text-white flex justify-between items-center">
        <div>
            <p className="text-xs font-bold text-purple-200 uppercase tracking-wider mb-1">Jadwal Kocok Berikutnya</p>
            <h3 className="text-lg font-bold">{nextArisanDate ? formatDate(nextArisanDate) : 'Belum Dijadwalkan'}</h3>
            {arisanTime && <p className="text-sm text-purple-100">Pukul {arisanTime} WIB</p>}
        </div>
        <div className="text-3xl bg-white bg-opacity-20 p-2 rounded-lg">🗓️</div>
      </div>
      
      {/* Total Pot Card */}
      <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500 flex justify-between items-center">
          <div>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total Dapat (Pot)</p>
              <p className="font-bold text-gray-800 text-2xl">{formatRupiah(totalPot)}</p>
              <p className="text-xs text-gray-400">Estimasi jika semua bayar</p>
          </div>
          <div className="text-2xl text-green-500 bg-green-50 p-2 rounded-full">💰</div>
      </div>

      {/* Bank Info Card (If Exists) */}
      {(bankDetails.bankName || bankDetails.accountNumber) && (
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500 flex justify-between items-center">
              <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Rekening Pembayaran</p>
                  <p className="font-bold text-gray-800 text-lg">{bankDetails.bankName} - {bankDetails.accountNumber}</p>
                  <p className="text-sm text-gray-600">a.n {bankDetails.accountHolder}</p>
              </div>
              <button 
                onClick={() => {
                    navigator.clipboard.writeText(`${bankDetails.bankName} ${bankDetails.accountNumber} a.n ${bankDetails.accountHolder}`);
                    toast.success('Info rekening disalin');
                }}
                className="text-blue-500 bg-blue-50 p-2 rounded-full hover:bg-blue-100"
              >
                  📋
              </button>
          </div>
      )}

      {/* Financial Summary Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 rounded-lg shadow-lg text-white relative overflow-hidden">
        <div className="relative z-10">
            <h2 className="text-blue-100 text-xs font-bold uppercase tracking-wide mb-1">Total Terkumpul (Bulan Ini)</h2>
            <div className="flex items-baseline gap-2">
                <p className="text-4xl font-extrabold">{formatRupiah(totalCollected)}</p>
                <span className="text-blue-200 text-sm">/ {formatRupiah(members.length * billAmount)}</span>
            </div>
            
            <div className="mt-6">
                <div className="flex justify-between text-xs mb-2 text-blue-100 font-medium">
                    <span>Progress: {paidCount} dari {totalMembers} orang</span>
                    <span>{Math.round(progressPercent)}%</span>
                </div>
                <div className="w-full bg-black bg-opacity-20 rounded-full h-3 backdrop-blur-sm">
                    <div 
                        className="bg-white h-3 rounded-full transition-all duration-1000 ease-out shadow-sm relative overflow-hidden" 
                        style={{ width: `${progressPercent}%` }}
                    >
                        <div className="absolute inset-0 bg-white opacity-30 animate-[shimmer_2s_infinite]"></div>
                    </div>
                </div>
            </div>
        </div>
        
        {/* Decorative Circle */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-blue-300 opacity-20 rounded-full blur-2xl"></div>
      </div>

      {/* ... (Grid Stats & Recent Winners same) ... */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-gray-500 text-xs font-bold uppercase">Sudah Menang</h2>
          <p className="text-2xl font-bold text-gray-800 mt-1">{hasWonCount} <span className="text-sm font-normal text-gray-400">Orang</span></p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-gray-500 text-xs font-bold uppercase">Belum Menang</h2>
          <p className="text-2xl font-bold text-gray-800 mt-1">{remainingCount} <span className="text-sm font-normal text-gray-400">Orang</span></p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-gray-800 font-bold mb-4 flex items-center gap-2">
            <span className="text-yellow-500">🏆</span> Pemenang Terakhir
        </h2>
        {history.length > 0 ? (
          <div className="space-y-3">
             {history.slice(0, 3).map((record) => (
               <div key={record.id} className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                 <div>
                   <p className="font-medium text-gray-800">{record.winnerName}</p>
                   <p className="text-xs text-gray-400 mt-1">{record.date}</p>
                 </div>
                 <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Menang</span>
               </div>
             ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm italic">Belum ada pemenang yang diundi.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
