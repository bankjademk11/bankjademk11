import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const RootHandler = ({ setUserId }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const userIdFromUrl = searchParams.get('userID');

    if (userIdFromUrl) {
      setUserId(userIdFromUrl);
      navigate('/vote', { replace: true });
    } else {
      window.location.href = 'https://www.odienmall.com/lineoa';
    }
  }, [navigate, location, setUserId]);

  return null;
};

export default RootHandler;
