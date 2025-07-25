import React from 'react';

const DailyMenuControl = ({
  dailyMenuStatus,
  handleCloseVoting,
  adminDirectSelectFoodId,
  setAdminDirectSelectFoodId,
  handleAdminSetFood,
  foodItems,
}) => {
  return (
    <>
      {/* Close Voting */}
      {dailyMenuStatus === 'voting' && (
        <div className="mb-6 pt-4 border-t border-gray-200">
          <h3 className="mb-4 text-xl font-semibold text-gray-700">ປິດການໂຫວດ:</h3>
          <button
            onClick={handleCloseVoting}
            className="w-full px-6 py-3 font-bold text-white transition duration-300 ease-in-out transform bg-orange-500 shadow-lg rounded-xl hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
          >
            ປິດການໂຫວດ
          </button>
        </div>
      )}

      {/* Admin Direct Select Food */}
      <div className="pt-4 border-t border-gray-200">
        <h3 className="mb-4 text-xl font-semibold text-gray-700">ຕັ້ງຄ່າເມນູປະຈຳວັນໂດຍກົງ:</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto p-2 border rounded-lg bg-gray-50">
          {foodItems.map(food => (
            <div
              key={food.id}
              className={`p-3 border rounded-lg flex flex-col items-center shadow-md cursor-pointer ${
                adminDirectSelectFoodId === food.id ? 'bg-purple-100 border-purple-400' : 'bg-white border-gray-200'
              }`}
              onClick={() => setAdminDirectSelectFoodId(food.id)}
            >
              <img
                src={food.image}
                alt={food.name}
                className="w-24 h-24 object-cover rounded-md mb-2"
                onError={(e) => { e.target.onerror = null; e.target.src = `/BG.png`; }}
              />
              <span className="font-medium text-gray-800 text-center">{food.name}</span>
            </div>
          ))}
        </div>
        <button
          onClick={handleAdminSetFood}
          disabled={!adminDirectSelectFoodId}
          className="mt-4 w-full px-6 py-3 font-bold text-white transition duration-300 ease-in-out transform bg-purple-600 shadow-lg rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
        >
          ຕັ້ງຄ່າເມນູປະຈຳວັນ
        </button>
      </div>
    </>
  );
};

export default DailyMenuControl;