import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you use React Router for navigation

const Header = ({ userId }) => {
  return (
    <header className="bg-teal-700 shadow-medium border-b border-gray-200 mb-8">
      <div className="container mx-auto px-6 py-4 flex justify-center items-center">
        <Link to="/" className="flex items-center space-x-4">
          <img src="/FoodODG.png" alt="FoodODG Logo" className="h-12 w-auto" />
          <span className="text-xl font-bold text-white tracking-wider">
            ODIEN COOKING
          </span>
        </Link>
      </div>
    </header>
  );
};

export default Header;