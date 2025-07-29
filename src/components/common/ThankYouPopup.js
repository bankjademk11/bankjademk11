import React from 'react';

const ThankYouPopup = ({ show, onClose, message }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-sm mx-auto">
        <h2 className="text-2xl font-bold text-teal-700 mb-4">{message}</h2>
        <button
          onClick={onClose}
          className="px-6 py-2 bg-teal-600 text-white rounded-lg shadow-md hover:bg-teal-700 transition"
        >
          ຕົກລົງ
        </button>
      </div>
    </div>
  );
};

export default ThankYouPopup;