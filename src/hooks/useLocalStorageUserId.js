import { useState, useEffect } from 'react';

const getUserIdFromLocalStorage = () => {
  return localStorage.getItem('offlineUserId');
};

const useLocalStorageUserId = () => {
  const [userId, setUserId] = useState(getUserIdFromLocalStorage());

  useEffect(() => {
    const handleStorageChange = () => {
      setUserId(getUserIdFromLocalStorage());
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

  return userId;
};

export default useLocalStorageUserId;
