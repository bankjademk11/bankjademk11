import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="flex justify-center space-x-4 mb-8">
      <Link
        to="/"
        className="px-6 py-3 rounded-xl font-bold transition duration-300 bg-gray-200 text-gray-700 hover:bg-gray-300 shadow-lg"
      >
        ເມນູສ່ວນຕົວ
      </Link>
      <Link
        to="/vote"
        className="px-6 py-3 rounded-xl font-bold transition duration-300 bg-gray-200 text-gray-700 hover:bg-gray-300 shadow-lg"
      >
        ໂຫວດເມນູປະຈຳວັນ
      </Link>
      <Link
        to="/admin"
        className="px-6 py-3 rounded-xl font-bold transition duration-300 bg-gray-200 text-gray-700 hover:bg-gray-300 shadow-lg"
      >
        ແຜງຄວບຄຸມແອັດມິນ
      </Link>
    </nav>
  );
};

export default Navigation;