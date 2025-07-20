import React from 'react';

const Navigation = ({ currentPage, setCurrentPage }) => {
  return (
    <nav className="flex justify-center space-x-4 mb-8">
      <button
        onClick={() => setCurrentPage('my_foods')}
        className={`px-6 py-3 rounded-xl font-bold transition duration-300 ${
          currentPage === 'my_foods' ? 'bg-teal-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        เมนูส่วนตัว
      </button>
      <button
        onClick={() => setCurrentPage('vote')}
        className={`px-6 py-3 rounded-xl font-bold transition duration-300 ${
          currentPage === 'vote' ? 'bg-teal-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        โหวตเมนูประจำวัน
      </button>
      <button
        onClick={() => setCurrentPage('admin')}
        className={`px-6 py-3 rounded-xl font-bold transition duration-300 ${
          currentPage === 'admin' ? 'bg-teal-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        แผงควบคุมแอดมิน
      </button>
    </nav>
  );
};

export default Navigation;