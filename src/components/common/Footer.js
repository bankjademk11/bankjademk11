import React from 'react';

const Footer = ({ userId }) => {
  return (
    <footer className="bg-gradient-to-r from-teal-700 to-teal-900 text-white py-6 border-t border-teal-600">
      <div className="container mx-auto px-6 text-center">
        <p className="text-sm">
          ລະຫັດຜູ້ໃຊ້: <span className="font-semibold">{userId}</span>
        </p>
        <p className="text-xs text-teal-200 mt-2">
          &copy; {new Date().getFullYear()} ODIEN COOKING. ສະລັດທຸກລິຂະສິດ.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
