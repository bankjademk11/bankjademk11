import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import getAuthStatusFromUrl from './AuthGate'; // AuthGate is now a utility function

const RootHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const { userId: userIdFromUrl, errorType: errorTypeFromUrl } = getAuthStatusFromUrl(location);
    let currentUserId = localStorage.getItem('offlineUserId');

    if (userIdFromUrl) {
      // If userId is in URL, use it and store it
      localStorage.setItem('offlineUserId', userIdFromUrl);
      currentUserId = userIdFromUrl;
    } else if (errorTypeFromUrl) {
      // If error is in URL, clear userId and store error
      localStorage.removeItem('offlineUserId');
      localStorage.setItem('authError', errorTypeFromUrl);
    } else if (currentUserId) {
      // If userId is in localStorage, use it
      // No action needed, currentUserId is already set
    } else {
      // No userId in URL or localStorage, and no error in URL
      // This means it's a fresh visit without any auth info
      localStorage.removeItem('offlineUserId');
      localStorage.setItem('authError', 'no_userid');
    }

    // After processing, decide where to navigate
    if (currentUserId) {
      navigate('/vote', { replace: true });
    } else {
      const finalErrorType = localStorage.getItem('authError');
      if (finalErrorType) {
        // Navigate to root with error parameter if not already there
        if (location.pathname !== '/' || new URLSearchParams(location.search).get('error') !== finalErrorType) {
          navigate(`/?error=${finalErrorType}`, { replace: true });
        }
      }
    }
  }, [navigate, location]);

  // This component doesn't render anything, it just handles logic and redirects
  return null;
};

export default RootHandler;
