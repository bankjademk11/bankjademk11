import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = ({ isAdmin }) => {
  return (
    <nav className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 mb-10 p-4 bg-surface rounded-lg shadow-md">
      {isAdmin && (
        <Link
          to="/admin/my-foods"
          className="px-6 py-3 rounded-full font-bold transition duration-300 bg-primary text-white hover:bg-opacity-90 shadow-md text-center"
        >
          ເມນູສ່ວນຕົວ
        </Link>
      )}
      <Link
        to="/vote"
        className="px-6 py-3 rounded-full font-bold transition duration-300 bg-primary text-white hover:bg-opacity-90 shadow-md text-center"
      >
        ໂຫວດເມນູປະຈຳວັນ
      </Link>
      {isAdmin && (
        <Link
          to="/admin"
          className="px-6 py-3 rounded-full font-bold transition duration-300 bg-primary text-white hover:bg-opacity-90 shadow-md text-center"
        >
          ແຜງຄວບຄຸມແອັດມິນ
        </Link>
      )}
    </nav>
  );
};

export default Navigation;