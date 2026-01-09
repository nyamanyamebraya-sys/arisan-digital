import React, { createContext, useContext, useState, useEffect } from 'react';

const ArisanContext = createContext();

export const useArisan = () => useContext(ArisanContext);

export const ArisanProvider = ({ children }) => {
  const [members, setMembers] = useState(() => {
    const saved = localStorage.getItem('arisan_members');
    return saved ? JSON.parse(saved) : [];
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('arisan_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [billAmount, setBillAmount] = useState(() => {
    const saved = localStorage.getItem('arisan_bill_amount');
    return saved ? parseInt(saved) : 100000; // Default 100rb
  });

  const [bankDetails, setBankDetails] = useState(() => {
    const saved = localStorage.getItem('arisan_bank_details');
    return saved ? JSON.parse(saved) : { bankName: '', accountNumber: '', accountHolder: '' };
  });

  const [dueDate, setDueDate] = useState(() => {
    return localStorage.getItem('arisan_due_date') || '';
  });

  const [adminPassword, setAdminPassword] = useState(() => {
    return localStorage.getItem('arisan_admin_password') || 'admin123';
  });

  // Auth State
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('arisan_user_role') || null;
  });

  useEffect(() => {
    localStorage.setItem('arisan_admin_password', adminPassword);
  }, [adminPassword]);

  useEffect(() => {
    localStorage.setItem('arisan_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('arisan_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('arisan_bill_amount', billAmount.toString());
  }, [billAmount]);

  useEffect(() => {
    localStorage.setItem('arisan_bank_details', JSON.stringify(bankDetails));
  }, [bankDetails]);

  useEffect(() => {
    localStorage.setItem('arisan_due_date', dueDate);
  }, [dueDate]);

  useEffect(() => {
    if (userRole) {
      localStorage.setItem('arisan_user_role', userRole);
    } else {
      localStorage.removeItem('arisan_user_role');
    }
  }, [userRole]);

  const login = (role) => {
    setUserRole(role);
  };

  const logout = () => {
    setUserRole(null);
  };

  const addMember = (name, phone = '') => {
    const newMember = {
      id: Date.now().toString(),
      name,
      phone,
      hasWon: false,
      hasPaid: false, // New field for payment tracking
    };
    setMembers(prev => [...prev, newMember]);
  };

  const updateMember = (id, updates) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const removeMember = (id) => {
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  const drawWinner = () => {
    // We need current members for this logic, so we use the state directly
    // but the update should be functional to be safe, or we trust 'members' dependency
    // Since drawWinner depends on random selection from current state, it's better to
    // keep using 'members' for selection but use functional update for setting state.
    
    const candidates = members.filter(m => !m.hasWon);
    if (candidates.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * candidates.length);
    const winner = candidates[randomIndex];
    
    // Update member status
    setMembers(prev => prev.map(m => 
      m.id === winner.id ? { ...m, hasWon: true } : m
    ));

    // Add to history
    const winRecord = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      winnerId: winner.id,
      winnerName: winner.name
    };
    setHistory(prev => [winRecord, ...prev]);
    
    return winner;
  };

  const resetArisan = () => {
    // Only reset win status, keep payment status or maybe reset both?
    // Usually a new period means reset payment status too.
    setMembers(prev => prev.map(m => ({ ...m, hasWon: false, hasPaid: false })));
  };

  const resetPaymentStatus = () => {
    setMembers(prev => prev.map(m => ({ ...m, hasPaid: false })));
  };

  const importData = (jsonData) => {
    try {
      const data = JSON.parse(jsonData);
      if (data.members && data.history) {
        setMembers(data.members);
        setHistory(data.history);
        if (data.billAmount) setBillAmount(data.billAmount);
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const exportData = () => {
    const data = {
      members,
      history,
      billAmount,
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  };

  return (
    <ArisanContext.Provider value={{ 
      members, 
      history,
      billAmount,
      setBillAmount,
      bankDetails,
      setBankDetails,
      dueDate,
      setDueDate,
      adminPassword,
      setAdminPassword,
      userRole,
      login,
      logout,
      addMember, 
      updateMember,
      removeMember, 
      drawWinner,
      resetArisan,
      resetPaymentStatus,
      importData,
      exportData
    }}>
      {children}
    </ArisanContext.Provider>
  );
};
