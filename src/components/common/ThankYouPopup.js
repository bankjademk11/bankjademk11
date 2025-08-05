import React from 'react';

const ThankYouPopup = ({ show, onClose, message }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-surface p-10 rounded-2xl shadow-2xl text-center max-w-sm mx-auto">
        <h2 className="text-3xl font-bold text-primary mb-6">{message}</h2>
        <button
          onClick={onClose}
          className="px-8 py-3 bg-primary text-white rounded-lg shadow-lg hover:bg-opacity-90 hover:shadow-xl transition-all duration-300"
        >
          ຕົກລົງ
        </button>
      </div>
    </div>
  );
};

export default ThankYouPopup;