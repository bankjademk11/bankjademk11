import React from 'react';
import { NavLink } from 'react-router-dom';

const Navigation = ({ isAdmin }) => {
  const navLinkClasses = "px-5 py-2 rounded-md text-base font-medium transition-all duration-300";
  const activeLinkClasses = "bg-white text-teal-700 shadow-sm";
  const inactiveLinkClasses = "text-white hover:bg-teal-600";

  return (
    <nav className="flex justify-center mb-10">
      <div className="flex flex-wrap gap-2 p-2 bg-gradient-to-r from-teal-600 to-teal-800 rounded-lg shadow-md">
        {isAdmin && (
          <NavLink
            to="/admin/my-foods"
            className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}
          >
            ເມນູສ່ວນຕົວ
          </NavLink>
        )}
        {isAdmin && (
          <NavLink
            to="/vote"
            className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}
          >
            ໂຫວດເມນູປະຈຳວັນ
          </NavLink>
        )}
        {isAdmin && (
          <NavLink
            to="/admin"
            className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}
          >
            ແຜງຄວບຄຸມແອັດມິນ
          </NavLink>
        )}
      </div>
    </nav>
  );
};

export default Navigation;