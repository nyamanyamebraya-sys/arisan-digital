import React, { createContext, useContext, useState, useEffect } from 'react';

const ArisanContext = createContext();

export const useArisan = () => useContext(ArisanContext);

export const ArisanProvider = ({ children }) => {
  // Multi-Group State
  const [groups, setGroups] = useState(() => {
    const savedGroups = localStorage.getItem('arisan_groups');
    if (savedGroups) return JSON.parse(savedGroups);
    
    // Migration: If no groups but old data exists, create default group
    const oldMembers = localStorage.getItem('arisan_members');
    if (oldMembers) {
      return [{
        id: 'default',
        name: 'Arisan Utama',
        members: JSON.parse(oldMembers),
        history: JSON.parse(localStorage.getItem('arisan_history') || '[]'),
        billAmount: parseInt(localStorage.getItem('arisan_bill_amount') || '100000'),
        bankDetails: JSON.parse(localStorage.getItem('arisan_bank_details') || '{}'),
        dueDate: localStorage.getItem('arisan_due_date') || ''
      }];
    }
    
    // Fresh start
    return [{
      id: 'default',
      name: 'Arisan Utama',
      members: [],
      history: [],
      billAmount: 100000,
      bankDetails: { bankName: '', accountNumber: '', accountHolder: '' },
      dueDate: ''
    }];
  });

  const [activeGroupId, setActiveGroupId] = useState(() => {
    return localStorage.getItem('arisan_active_group_id') || 'default';
  });

  // Derived state for current group
  const activeGroup = groups.find(g => g.id === activeGroupId) || groups[0];

  // Helper to update active group data
  const updateActiveGroup = (updates) => {
    setGroups(prev => prev.map(g => 
      g.id === activeGroupId ? { ...g, ...updates } : g
    ));
  };

  // Legacy state wrappers (to keep API compatible)
  const members = activeGroup.members;
  const history = activeGroup.history;
  const billAmount = activeGroup.billAmount;
  const bankDetails = activeGroup.bankDetails || { bankName: '', accountNumber: '', accountHolder: '' };
  const dueDate = activeGroup.dueDate || '';
  const nextArisanDate = activeGroup.nextArisanDate || '';
  const arisanTime = activeGroup.arisanTime || '';

  // Setters wrappers
  const setBillAmount = (val) => updateActiveGroup({ billAmount: val });
  const setBankDetails = (val) => updateActiveGroup({ bankDetails: val });
  const setDueDate = (val) => updateActiveGroup({ dueDate: val });
  const setNextArisanDate = (val) => updateActiveGroup({ nextArisanDate: val });
  const setArisanTime = (val) => updateActiveGroup({ arisanTime: val });

  // Global Settings (Shared across groups)
  const [adminPassword, setAdminPassword] = useState(() => {
    return localStorage.getItem('arisan_admin_password') || 'admin123';
  });

  const [appLogo, setAppLogo] = useState(() => {
    return localStorage.getItem('arisan_app_logo') || null;
  });

  // Auth State
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('arisan_user_role') || null;
  });

  // Persistence
  useEffect(() => {
    localStorage.setItem('arisan_groups', JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem('arisan_active_group_id', activeGroupId);
  }, [activeGroupId]);

  useEffect(() => {
    localStorage.setItem('arisan_admin_password', adminPassword);
  }, [adminPassword]);

  useEffect(() => {
    if (appLogo) {
      localStorage.setItem('arisan_app_logo', appLogo);
    } else {
      localStorage.removeItem('arisan_app_logo');
    }
  }, [appLogo]);

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

  // Group Management Functions
  const createGroup = (name) => {
    const newGroup = {
      id: Date.now().toString(),
      name,
      members: [],
      history: [],
      billAmount: 100000,
      bankDetails: { bankName: '', accountNumber: '', accountHolder: '' },
      dueDate: ''
    };
    setGroups(prev => [...prev, newGroup]);
    setActiveGroupId(newGroup.id);
  };

  const switchGroup = (id) => {
    if (groups.find(g => g.id === id)) {
      setActiveGroupId(id);
    }
  };

  const deleteGroup = (id) => {
    if (groups.length <= 1) return; // Prevent deleting last group
    const newGroups = groups.filter(g => g.id !== id);
    setGroups(newGroups);
    if (activeGroupId === id) {
      setActiveGroupId(newGroups[0].id);
    }
  };

  const updateGroupName = (name) => {
    updateActiveGroup({ name });
  };

  const addMember = (name, phone = '') => {
    const newMember = {
      id: Date.now().toString(),
      name,
      phone,
      hasWon: false,
      hasPaid: false, 
    };
    updateActiveGroup({ members: [...members, newMember] });
  };

  const updateMember = (id, updates) => {
    updateActiveGroup({ 
      members: members.map(m => m.id === id ? { ...m, ...updates } : m) 
    });
  };

  const removeMember = (id) => {
    updateActiveGroup({ 
      members: members.filter(m => m.id !== id) 
    });
  };

  const drawWinner = () => {
    const candidates = members.filter(m => !m.hasWon);
    if (candidates.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * candidates.length);
    const winner = candidates[randomIndex];
    
    // Update member status
    const updatedMembers = members.map(m => 
      m.id === winner.id ? { ...m, hasWon: true } : m
    );

    // Add to history
    const winRecord = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      winnerId: winner.id,
      winnerName: winner.name
    };
    
    updateActiveGroup({
      members: updatedMembers,
      history: [winRecord, ...history]
    });
    
    return winner;
  };

  const resetArisan = () => {
    updateActiveGroup({ 
      members: members.map(m => ({ ...m, hasWon: false, hasPaid: false })) 
    });
  };

  const resetPaymentStatus = () => {
    updateActiveGroup({ 
      members: members.map(m => ({ ...m, hasPaid: false })) 
    });
  };

  const importData = (jsonData) => {
    try {
      const data = JSON.parse(jsonData);
      // Support old format import (convert to single group)
      if (data.members && !data.groups) {
         updateActiveGroup({
            members: data.members,
            history: data.history || [],
            billAmount: data.billAmount || 100000,
            bankDetails: data.bankDetails || {},
             dueDate: data.dueDate || '',
             nextArisanDate: data.nextArisanDate || '',
             arisanTime: data.arisanTime || ''
          });
          if (data.adminPassword) setAdminPassword(data.adminPassword);
         if (data.appLogo) setAppLogo(data.appLogo);
         return true;
      }
      // Support new format (all groups)
      if (data.groups) {
        setGroups(data.groups);
        setAdminPassword(data.adminPassword || 'admin123');
        setAppLogo(data.appLogo || null);
        setActiveGroupId(data.groups[0].id);
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const exportData = () => {
    const data = {
      groups, // Export all groups
      adminPassword,
      appLogo,
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  };

  return (
    <ArisanContext.Provider value={{ 
      // Active Group Data (For compatibility)
      members, 
      history,
      billAmount,
      setBillAmount,
      bankDetails,
      setBankDetails,
      dueDate,
      setDueDate,
      nextArisanDate,
      setNextArisanDate,
      arisanTime,
      setArisanTime,
      
      // Global Settings
      adminPassword,
      setAdminPassword,
      appLogo,
      setAppLogo,
      userRole,
      login,
      logout,
      
      // Actions
      addMember, 
      updateMember,
      removeMember, 
      drawWinner,
      resetArisan,
      resetPaymentStatus,
      importData,
      exportData,

      // Multi-Group API
      groups,
      activeGroupId,
      activeGroupName: activeGroup.name,
      createGroup,
      switchGroup,
      deleteGroup,
      updateGroupName
    }}>
      {children}
    </ArisanContext.Provider>
  );
};
