import React from 'react';

const Header = ({ userId }) => {
  return (
    <header className="mb-8 text-center drop-shadow-xl">
      <img src="/FoodODG.png" alt="FoodODG Logo" className="mx-auto mb-4" style={{ maxWidth: '150px' }} />
      <h1 className="mb-2 text-5xl font-extrabold text-black drop-shadow-lg">
        ODIEN COOKING
      </h1>
      <p className="text-xl text-gray-800">ODIEN COOKING</p>
      <p className="text-sm text-gray-500 mt-2">ລະຫັດຜູ້ໃຊ້: {userId}</p>
    </header>
  );
};

export default Header;