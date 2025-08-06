import React from 'react';

const Footer = ({ userId }) => {
  return (
    <footer className="bg-teal-700 shadow-medium border-t border-gray-200 mt-8 py-4">
      <div className="container mx-auto px-6 text-center">
        <p className="text-sm text-white">ລະຫັດຜູ້ໃຊ້: <span className="font-semibold text-white">{userId}</span></p>
      </div>
    </footer>
  );
};

export default Footer;