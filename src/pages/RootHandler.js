import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthGate from './AuthGate';
import { AuthRequiredMessage } from '../components';
import useLocalStorageUserId from '../hooks/useLocalStorageUserId';

const RootHandler = () => {
  const userId = useLocalStorageUserId();
  const navigate = useNavigate();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const errorType = urlParams.get('error');

  useEffect(() => {
    if (userId) {
      // If userId exists, navigate to /vote
      if (location.pathname !== '/vote') {
        navigate('/vote', { replace: true });
      }
      // Clear any authError from localStorage if userId is present
      localStorage.removeItem('authError');
    } else if (errorType) {
      // If no userId but there's an error in URL, display AuthRequiredMessage
      // No navigation needed here, as AuthRequiredMessage will be rendered
    } else {
      // If no userId and no error in URL, render AuthGate to process URL
      // AuthGate will set userId or authError in localStorage
    }
  }, [userId, navigate, location, errorType]);

  if (userId) {
    // This case is handled by useEffect, which navigates to /vote
    return null;
  } else if (errorType) {
    // If there's an error in the URL, display the message
    return <AuthRequiredMessage />;
  } else {
    // Otherwise, render AuthGate to process the URL
    return <AuthGate />;
  }
};

export default RootHandler;
