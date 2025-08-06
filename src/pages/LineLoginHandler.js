import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LineLoginHandler = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userIdFromUrl = urlParams.get('userid');

    if (userIdFromUrl) {
      // Store userId in localStorage
      localStorage.setItem('offlineUserId', userIdFromUrl);
      // Redirect to the main app page
      navigate('/', { replace: true });
    } else {
      // If no userId in URL, display error
      setError("Error: ไม่มี UID. กรุณาเข้าใช้งานผ่านลิงก์ที่มี UID.");
    }
  }, [navigate]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500 text-xl font-bold text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen text-primary text-xl font-bold text-center">
      กำลังตรวจสอบ UID...
    </div>
  );
};

export default LineLoginHandler;
