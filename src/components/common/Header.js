import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ userId }) => {
  return (
    <header className="bg-gradient-to-r from-teal-600 to-teal-800 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-3">
              <img src="/FoodODG.png" alt="FoodODG Logo" className="h-10 w-auto" />
              <span className="text-2xl font-bold tracking-tight">
                ODIEN COOKING
              </span>
            </Link>
          </div>
          
          
        </div>
      </div>
    </header>
  );
};

export default Header;