import React from 'react';

const MessageDisplay = ({ message }) => {
  if (!message.text) return null;

  return (
    <div
      className={`fixed top-6 right-6 z-50 p-5 rounded-xl shadow-xl text-white font-semibold transition-all duration-500 ease-in-out transform
        ${message.type === 'success' ? 'bg-green-600' :
        message.type === 'error' ? 'bg-red-600' : 'bg-primary'}
      }`}
    >
      <div>
        <span>{message.text}</span>
      </div>
    </div>
  );
};

export default MessageDisplay;