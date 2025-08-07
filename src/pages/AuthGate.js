import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthGate = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const userIdFromUrl = urlParams.get('userID'); // Check for userID in URL
    console.log('AuthGate: userIdFromUrl', userIdFromUrl);
    let storedUserId = localStorage.getItem('offlineUserId'); // Check for userID in localStorage
    console.log('AuthGate: storedUserId', storedUserId);

    let finalUserId = null;
    let errorType = null;

    if (userIdFromUrl) {
      if (userIdFromUrl.toLowerCase() === 'emtry') {
        errorType = 'invalid_userid';
        console.log('AuthGate: userIdFromUrl is Emtry');
      } else {
        finalUserId = userIdFromUrl;
        console.log('AuthGate: finalUserId from URL', finalUserId);
      }
    } else if (storedUserId) {
      finalUserId = storedUserId;
      console.log('AuthGate: finalUserId from stored', finalUserId);
    }

    if (finalUserId) {
      console.log('AuthGate: Setting offlineUserId in localStorage', finalUserId);
      localStorage.setItem('offlineUserId', finalUserId);
      console.log('AuthGate: Dispatching userLoggedIn event');
      window.dispatchEvent(new Event('userLoggedIn')); // Notify App.js
    } else {
      // If no userId from URL and no stored userId, or if userIdFromUrl was 'Emtry'
      if (!errorType) {
        errorType = 'no_userid';
      }
      console.log('AuthGate: Navigating to error', errorType);
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
