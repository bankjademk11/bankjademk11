import React from 'react';

const AdminLogin = ({ adminPasswordInput, setAdminPasswordInput, handleAdminLogin }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-500 to-teal-700 p-4">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-md">
        <div className="p-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-teal-100 p-4 rounded-full">
                <i className="fas fa-user-shield text-4xl text-teal-600"></i>
              </div>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">ຜູ້ດູແລລະບົບ</h2>
            <p className="text-gray-600 mb-8">ກະລຸນາເຂົ້າສູ່ລະບົບ</p>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="admin-password">
              <i className="fas fa-lock mr-2"></i>ລະຫັດຜ່ານ
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type="password"
                value={adminPasswordInput}
                onChange={(e) => setAdminPasswordInput(e.target.value)}
                className="appearance-none border border-gray-300 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200 ease-in-out pl-10"
                placeholder="******************"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <i className="fas fa-lock text-gray-400"></i>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleAdminLogin}
            className="w-full bg-gradient-to-r from-teal-600 to-teal-800 hover:from-teal-700 hover:to-teal-900 text-white font-bold py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition duration-200 ease-in-out transform hover:scale-105 shadow-lg flex items-center justify-center"
          >
            <i className="fas fa-sign-in-alt mr-2"></i> ເຂົ້າສູ່ລະບົບ
          </button>
        </div>
        
        <div className="bg-gray-50 px-8 py-6 text-center">
          <p className="text-gray-600 text-sm">
            <i className="fas fa-exclamation-circle mr-1"></i>ຖ້າທ່ານບໍ່ແມ່ນຜູ້ດູແລລະບົບ, ກະລຸນາອອກຈາກໜ້ານີ້.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;