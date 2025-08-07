import { useState, useEffect } from 'react';

const getUserIdFromLocalStorage = () => {
  const id = localStorage.getItem('offlineUserId');
  console.log('useLocalStorageUserId: Reading from localStorage', id);
  return id;
};

const useLocalStorageUserId = () => {
  const [userId, setUserId] = useState(() => {
    const initialId = getUserIdFromLocalStorage();
    console.log('useLocalStorageUserId: Initial state', initialId);
    return initialId;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const newId = getUserIdFromLocalStorage();
      console.log('useLocalStorageUserId: Storage/Event change detected, new ID', newId);
      setUserId(newId);
    };

    // Listen for changes in localStorage across tabs/windows
    window.addEventListener('storage', handleStorageChange);
    // Listen for our custom event dispatched by AuthGate
    window.addEventListener('userLoggedIn', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userLoggedIn', handleStorageChange);
    };
  }, []);

  console.log('useLocalStorageUserId: Current userId state', userId);
  return userId;
};

export default useLocalStorageUserId;
