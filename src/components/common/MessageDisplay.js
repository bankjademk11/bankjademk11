import React from 'react';

const MessageDisplay = ({ message }) => {
  if (!message.text) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-2xl text-white font-semibold transition-all duration-300 transform ${
        message.type === 'success' ? 'bg-green-500' :
        message.type === 'error' ? 'bg-red-500' : 'bg-blue-500' // No direct translation for 'info' type, keeping original color for now
      }
      }`}
    >
      <div>
        <span>{message.text}</span>
      </div>
    </div>
  );
};

export default MessageDisplay;