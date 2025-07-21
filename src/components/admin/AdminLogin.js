import React from 'react';

const AdminLogin = ({ adminPasswordInput, setAdminPasswordInput, handleAdminLogin }) => {
  return (
    <div className="text-center space-y-4">
      <p className="text-lg text-gray-700">กรุณาเข้าสู่ระบบแอดมิน</p>
      <input
        type="password"
        value={adminPasswordInput}
        onChange={(e) => setAdminPasswordInput(e.target.value)}
        className="block w-full max-w-xs mx-auto px-4 py-3 mt-1 text-lg border border-gray-300 shadow-md rounded-xl focus:ring-teal-500 focus:border-teal-500"
        placeholder="รหัสผ่านแอดมิน"
      />
      <button
        onClick={handleAdminLogin}
        className="px-8 py-3 font-bold text-white transition duration-300 ease-in-out transform bg-teal-600 shadow-xl rounded-xl hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 hover:scale-105"
      >
        เข้าสู่ระบบ
      </button>
    </div>
  );
};

export default AdminLogin;