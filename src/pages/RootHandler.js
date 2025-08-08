import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import getAuthStatusFromUrl from './AuthGate'; // AuthGate is now a utility function

const RootHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const { userId: userIdFromUrl } = getAuthStatusFromUrl(location);
    
    if (userIdFromUrl) {
      // If a new userId is provided in the URL, we can decide what to do.
      // For now, we'll just navigate to the vote page.
      navigate('/vote', { replace: true });
    } else {
      // If no userId is found in the URL, redirect to the external page.
      window.location.href = 'https://www.odienmall.com/lineoa';
    }
  }, [navigate, location]);

  // This component doesn't render anything, it just handles logic and redirects
  return null;
};

export default RootHandler;
