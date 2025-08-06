import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
    FiHome, 
    FiUsers, 
    FiBarChart2, 
    FiSettings, 
    FiLogOut, 
    FiList, 
    FiCalendar 
} from 'react-icons/fi';

const Sidebar = () => {
  const baseLinkClasses = "flex items-center px-4 py-3 text-neutral-600 hover:bg-primary-light/20 hover:text-primary-dark transition-colors duration-200 rounded-lg";
  const activeLinkClasses = "bg-primary-light/20 text-primary-dark font-bold";

  return (
    <div className="w-64 bg-surface shadow-lg h-full flex flex-col">
      <div className="px-6 py-4 border-b border-neutral-200">
        <h2 className="text-2xl font-bold text-primary-dark">Admin Panel</h2>
        <p className="text-sm text-neutral-500">ODIEN COOKING</p>
      </div>
      <nav className="flex-grow px-4 py-4">
        <NavLink 
          to="/admin/dashboard"
          className={({ isActive }) => `${baseLinkClasses} ${isActive ? activeLinkClasses : ''}`}
        >
          <FiHome className="mr-3" />
          Dashboard
        </NavLink>
        <NavLink 
          to="/admin/my-foods"
          className={({ isActive }) => `${baseLinkClasses} ${isActive ? activeLinkClasses : ''}`}
        >
          <FiList className="mr-3" />
          จัดการเมนูอาหาร
        </NavLink>
        {/* Add other links as needed */}
      </nav>
      <div className="px-4 py-4 border-t border-neutral-200">
        <button className={`${baseLinkClasses} w-full`}>
            <FiLogOut className="mr-3" />
            ออกจากระบบ
        </button>
      </div>
    </div>
  );
};

export default Sidebar;