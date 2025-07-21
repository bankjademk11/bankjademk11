import React from 'react';

const Header = ({ userId }) => {
  return (
    <header className="mb-8 text-center drop-shadow-xl">
      <h1 className="mb-2 text-5xl font-extrabold text-teal-800 drop-shadow-lg">
        คลังอาหารของ ODG
      </h1>
      <p className="text-xl text-teal-600">จัดการรายการเมนูอาหารที่คุณชื่นชอบและโหวตเมนูประจำวัน</p>
      <p className="text-sm text-gray-500 mt-2">User ID: {userId}</p>
    </header>
  );
};

export default Header;