import React from 'react';

const FoodPackDetailPopup = ({ foodPackDetails, onClose }) => {
  if (!foodPackDetails) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl font-bold"
        >
          &times;
        </button>
        <div className="p-6">
          <h2 className="text-3xl font-bold text-primary mb-4">รายละเอียดชุดอาหาร</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {foodPackDetails.map(food => (
              <div key={food.id} className="flex flex-col items-center p-3 border rounded-lg shadow-sm">
                <img
                  src={food.image}
                  alt={food.name}
                  className="w-32 h-32 object-cover rounded-md mb-2"
                  onError={(e) => { e.target.onerror = null; e.target.src = `/BG.png`; }}
                />
                <span className="font-medium text-center text-primary">{food.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodPackDetailPopup;