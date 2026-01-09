import React, { useState } from 'react';
import { useArisan } from '../context/ArisanContext';

const Lottery = () => {
  const { members, drawWinner, userRole } = useArisan();
  const [winner, setWinner] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const isAdmin = userRole === 'admin';
  const candidates = members.filter(m => !m.hasWon);

  const handleDraw = () => {
    if (candidates.length === 0 || !isAdmin) return;
    
    setIsAnimating(true);
    setWinner(null);
    
    // Simple animation effect
    setTimeout(() => {
      const result = drawWinner();
      setWinner(result);
      setIsAnimating(false);
    }, 2000); // 2 seconds spin
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 py-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">Kocok Arisan</h2>
        <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          {candidates.length} Peserta Tersisa
        </div>
      </div>

      <div className="relative h-64 w-64 flex items-center justify-center">
        {isAnimating ? (
          <div className="absolute inset-0 rounded-full border-[12px] border-blue-100 border-t-blue-600 animate-spin"></div>
        ) : winner ? (
          <div className="absolute inset-0 rounded-full bg-yellow-50 border-4 border-yellow-400 animate-[bounce_1s_infinite] shadow-xl"></div>
        ) : (
          <div className="absolute inset-0 rounded-full bg-gray-50 border-4 border-gray-200"></div>
        )}
        
        <div className="relative z-10 flex flex-col items-center justify-center text-center">
            {isAnimating ? (
                 <span className="text-6xl animate-pulse">🎲</span>
            ) : winner ? (
                <>
                    <span className="text-5xl mb-2">🎉</span>
                    <h3 className="text-lg font-bold text-gray-500 uppercase tracking-wide">Pemenang</h3>
                    <p className="text-3xl font-black text-gray-800 px-4 leading-tight">{winner.name}</p>
                </>
            ) : (
                <span className="text-8xl text-gray-200 font-bold">?</span>
            )}
        </div>
      </div>

      {isAdmin ? (
        <>
          {!winner && !isAnimating && (
            <button
              onClick={handleDraw}
              disabled={candidates.length === 0}
              className={`w-full max-w-xs px-8 py-4 rounded-xl text-lg font-bold shadow-lg transform transition active:scale-95 ${
                candidates.length > 0 
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
              }`}
            >
              {candidates.length > 0 ? 'Kocok Sekarang!' : 'Semua Sudah Menang'}
            </button>
          )}

          {winner && (
             <button
              onClick={() => setWinner(null)}
              className="text-blue-600 font-medium hover:text-blue-800 transition underline underline-offset-4"
            >
              Kocok Lagi
            </button>
          )}
        </>
      ) : (
        <p className="text-gray-500 italic">Hanya Admin yang bisa mengocok arisan.</p>
      )}
    </div>
  );
};

export default Lottery;
