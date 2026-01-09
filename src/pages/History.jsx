import React from 'react';
import { useArisan } from '../context/ArisanContext';

const History = () => {
  const { history, resetArisan, userRole } = useArisan();
  const isAdmin = userRole === 'admin';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
        <div>
            <h2 className="text-lg font-bold text-gray-800">Riwayat Pemenang</h2>
            <p className="text-xs text-gray-500">Total {history.length} putaran</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {history.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {history.map((record) => (
              <li key={record.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition">
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-2xl shadow-sm">
                  🏆
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-800 text-lg">{record.winnerName}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {record.date}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-12 px-4 text-center">
            <div className="text-gray-300 text-5xl mb-4">📜</div>
            <p className="text-gray-500 font-medium">Belum ada riwayat</p>
            <p className="text-gray-400 text-sm mt-1">Lakukan pengocokan untuk melihat riwayat di sini.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
