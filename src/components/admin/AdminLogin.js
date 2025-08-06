import React from 'react';

const AdminLogin = ({ adminPasswordInput, setAdminPasswordInput, handleAdminLogin }) => {
  return (
    <div className="text-center space-y-6 p-8 bg-gray-100 bg-opacity-90 rounded-2xl shadow-lg max-w-md mx-auto">
      <p className="text-xl text-primary font-semibold">ກະລຸນາເຂົ້າສູ່ລະບົບແອັດມິນ</p>
      <input
        type="password"
        value={adminPasswordInput}
        onChange={(e) => setAdminPasswordInput(e.target.value)}
        className="block w-full px-4 py-3 text-lg border border-gray-300 shadow-sm rounded-lg focus:ring-primary focus:border-transparent transition-colors"
        placeholder="ລະຫັດຜ່ານແອັດມິນ"
      />
      <button
        onClick={handleAdminLogin}
        className="px-8 py-3 font-bold text-white transition duration-300 ease-in-out transform bg-primary shadow-md rounded-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        ເຂົ້າສູ່ລະບົບ
      </button>
    </div>
  );
};

export default AdminLogin;