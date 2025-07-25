import React from 'react';

const Header = ({ userId }) => {
  return (
    <header className="mb-8 text-center drop-shadow-xl">
      <img src="/FoodODG.png" alt="FoodODG Logo" className="mx-auto mb-4" style={{ maxWidth: '150px' }} />
      <div className="bg-gray-100 bg-opacity-70 p-4 rounded-lg shadow-md mb-4">
        <h1 className="mb-2 text-5xl font-extrabold text-blue-600 drop-shadow-lg font-playfair">
          ODIEN COOKING
        </h1>
        <p className="text-xl text-gray-700">Enjoy ກັບອາຫານຂອງທ່ານ</p>
      </div>
      <p className="text-sm text-gray-500 mt-2">ລະຫັດຜູ້ໃຊ້: {userId}</p>
    </header>
  );
};

export default Header;