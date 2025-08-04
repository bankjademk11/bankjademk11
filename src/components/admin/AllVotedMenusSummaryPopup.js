import React from 'react';

const AllVotedMenusSummaryPopup = ({ dailyMenu, foodItems, onClose }) => {
  if (!dailyMenu || !dailyMenu.vote_options || dailyMenu.vote_options.length === 0) {
    return null;
  }

  const getFoodDetails = (foodIds) => {
    return foodIds.map(id => foodItems.find(item => item.id === id)).filter(Boolean);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl font-bold"
        >
          &times;
        </button>
        <div className="p-6">
          <h2 className="text-3xl font-bold text-primary mb-4">ສະຫຼຸບເມນູທີ່ຖືກໂຫວດ</h2>
          {dailyMenu.vote_options.map((pack, index) => {
            const foodsInPack = getFoodDetails(pack.foodIds);
            return (
              <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
                <h3 className="text-xl font-semibold text-primary mb-2">{pack.name} ({pack.votes} ໂຫວດ)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {foodsInPack.map(food => (
                    <div key={food.id} className="flex flex-col items-center p-2 bg-white rounded-lg shadow-xs">
                      <img
                        src={food.image}
                        alt={food.name}
                        className="w-24 h-24 object-cover rounded-md mb-2"
                        onError={(e) => { e.target.onerror = null; e.target.src = `/BG.png`; }}
                      />
                      <span className="text-sm font-medium text-center text-primary">{food.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AllVotedMenusSummaryPopup;