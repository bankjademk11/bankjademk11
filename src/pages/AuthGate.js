import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthGate = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const userIdFromUrl = urlParams.get('userID'); // Check for userID in URL
    let storedUserId = localStorage.getItem('offlineUserId'); // Check for userID in localStorage

    let finalUserId = null;
    let errorType = null;

    if (userIdFromUrl) {
      if (userIdFromUrl.toLowerCase() === 'emtry') {
        errorType = 'invalid_userid';
      } else {
        finalUserId = userIdFromUrl;
      }
    } else if (storedUserId) {
      finalUserId = storedUserId;
    }

    if (finalUserId) {
      localStorage.setItem('offlineUserId', finalUserId);
      window.dispatchEvent(new Event('userLoggedIn')); // Notify App.js
    } else {
      // If no userId from URL and no stored userId, or if userIdFromUrl was 'Emtry'
      if (!errorType) {
        errorType = 'no_userid';
      }
      // Navigate to root with error parameter, if not already there
      if (location.pathname !== '/' || urlParams.get('error') !== errorType) {
        navigate(`/?error=${errorType}`, { replace: true });
      }
    }
  }, [navigate, location]);

  // This component doesn't render anything if it's redirecting
  // If it's displaying an error, App.js will handle it based on URL param
  return null;
};

export default AuthGate;
