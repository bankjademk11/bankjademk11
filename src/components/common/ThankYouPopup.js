import React from 'react';

const ThankYouPopup = ({ show, onClose, message }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-sm w-full transform transition-all duration-300 scale-100">
        <div className="text-6xl text-teal-500 mb-6">👍</div>
        <h2 className="text-2xl font-bold text-teal-800 mb-6">{message}</h2>
        <button
          onClick={onClose}
          className="px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-800 text-white rounded-lg shadow-lg hover:from-teal-700 hover:to-teal-900 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          ຕົກລົງ
        </button>
      </div>
    </div>
  );
};

export default ThankYouPopup;