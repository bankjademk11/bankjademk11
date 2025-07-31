import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you use React Router for navigation

const Header = ({ userId }) => {
  return (
    <header className="bg-surface shadow-md mb-8">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-3">
          <img src="/FoodODG.png" alt="FoodODG Logo" className="h-12 w-auto" />
          <span className="text-2xl font-bold text-primary font-sans">
            ODIEN COOKING
          </span>
        </Link>
        <div className="text-right">
          <p className="text-sm text-secondary font-sans">ລະຫັດຜູ້ໃຊ້</p>
          <p className="font-semibold text-primary font-sans">{userId}</p>
        </div>
      </div>
    </header>
  );
};

export default Header;