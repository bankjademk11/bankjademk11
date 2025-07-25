import React from 'react';

const Header = ({ userId }) => {
  return (
    <header className="mb-8 text-center drop-shadow-xl">
      <h1 className="mb-2 text-5xl font-extrabold text-teal-800 drop-shadow-lg">
        ຄັງອາຫານຂອງ ODG
      </h1>
      <p className="text-xl text-teal-600">ຈັດການລາຍການເມນູອາຫານທີ່ທ່ານມັກ ແລະ ໂຫວດເມນູປະຈຳວັນ</p>
      <p className="text-sm text-gray-500 mt-2">ລະຫັດຜູ້ໃຊ້: {userId}</p>
    </header>
  );
};

export default Header;