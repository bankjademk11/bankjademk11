import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CheckUserIdHandler = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('กำลังตรวจสอบ User ID...');

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
    } else {
      // If no userId or it's 'Emtry', display error
      setMessage("Error: ไม่มี User ID หรือ User ID ไม่ถูกต้อง. กรุณาเข้าใช้งานผ่านลิงก์ที่มี User ID ที่ถูกต้อง.");
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen text-primary text-xl font-bold text-center">
      {message}
    </div>
  );
};

export default CheckUserIdHandler;
