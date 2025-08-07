import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CheckUserIdHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userIdFromUrl = urlParams.get('userID'); // Assuming 'userID' is the query parameter name

    if (userIdFromUrl && userIdFromUrl.toLowerCase() !== 'emtry') {
      // Store userId in localStorage
      localStorage.setItem('offlineUserId', userIdFromUrl);
      // Dispatch a custom event to notify App.js that the user has logged in
      window.dispatchEvent(new Event('userLoggedIn'));
      // Redirect to the main app page
      navigate('/vote', { replace: true });
    } else if (!userIdFromUrl) {
      // If no userId in URL, navigate with no_userid error
      navigate('/vote?error=no_userid', { replace: true });
    } else if (userIdFromUrl.toLowerCase() === 'emtry') {
      // If userId is 'Emtry', navigate with invalid_userid error
      navigate('/vote?error=invalid_userid', { replace: true });
    }
  }, [navigate]);

  return null; // This component doesn't render anything, it just redirects
};

export default CheckUserIdHandler;
