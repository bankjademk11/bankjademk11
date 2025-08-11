import React from 'react';

const AdminLogin = ({ adminPasswordInput, setAdminPasswordInput, handleAdminLogin }) => {
  return (
      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-sm mx-auto">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-3">ແຜງຄວບຄຸມແອັດມິນ</h2>
        <p className="text-center text-gray-600 mb-8 text-lg">ກະລຸນາເຂົ້າສູ່ລະບົບແອັດມິນ</p>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="admin-password">
            ລະຫັດຜ່ານແອັດມິນ
          </label>
          <input
            id="admin-password"
            type="password"
            value={adminPasswordInput}
            onChange={(e) => setAdminPasswordInput(e.target.value)}
            className="appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
            placeholder="******************"
          />
        </div>
        <button
          onClick={handleAdminLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out transform hover:scale-105"
        >
          ເຂົ້າສູ່ລະບົບ
        </button>
      </div>
  );
};

export default AdminLogin;