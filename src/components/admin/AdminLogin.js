import React from 'react';

const AdminLogin = ({ adminPasswordInput, setAdminPasswordInput, handleAdminLogin }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">ແຜງຄວບຄຸມແອັດມິນ</h2>
        <p className="text-center text-gray-600 mb-6">ກະລຸນາເຂົ້າສູ່ລະບົບແອັດມິນ</p>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="admin-password">
            ລະຫັດຜ່ານແອັດມິນ
          </label>
          <input
            id="admin-password"
            type="password"
            value={adminPasswordInput}
            onChange={(e) => setAdminPasswordInput(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="******************"
          />
        </div>
        <button
          onClick={handleAdminLogin}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          ເຂົ້າສູ່ລະບົບ
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;