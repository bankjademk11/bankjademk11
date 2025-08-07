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
    <div className="p-6 bg-surface rounded-2xl shadow-lg">
      <h2 className="mb-6 text-3xl font-bold text-center text-primary">ຄວບຄຸມເມນູປະຈຳວັນ</h2>

      {/* Close Voting */}
      {dailyMenuStatus === 'voting' && (
        <div className="mb-6 pb-4 border-b border-gray-200">
          <h3 className="mb-4 text-xl font-semibold text-primary">ປິດການໂຫວດ:</h3>
          <button
            onClick={handleCloseVoting}
            className="w-full px-6 py-3 font-bold text-white transition duration-300 ease-in-out transform bg-red-500 shadow-md rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ປິດການໂຫວດ
          </button>
        </div>
      )}

      {/* Admin Direct Select Food */}
      <div className="pt-4">
        <h3 className="mb-4 text-xl font-semibold text-primary">ຕັ້ງຄ່າເມນູປະຈຳວັນໂດຍກົງ:</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto p-2 border border-gray-200 rounded-lg bg-background">
          {foodItems.map(food => (
            <div
              key={food.id}
              className={`p-3 border rounded-lg flex flex-col items-center shadow-sm cursor-pointer transition-all duration-200
                ${adminDirectSelectFoodId === food.id ? 'bg-primary text-white border-primary' : 'bg-surface border-gray-200 hover:bg-gray-50'}
              `}
              onClick={() => setAdminDirectSelectFoodId(food.id)}
            >
              <img
                src={food.image}
                alt={food.name}
                className="w-24 h-24 object-cover rounded-md mb-2"
                onError={(e) => { e.target.onerror = null; e.target.src = `/BG.png`; }}
              />
              <span className={`font-medium text-center ${adminDirectSelectFoodId === food.id ? 'text-white' : 'text-primary'}`}>{food.name}</span>
            </div>
          ))}
        </div>
        <button
          onClick={handleAdminSetFood}
          disabled={!adminDirectSelectFoodId}
          className="mt-6 w-full px-6 py-3 font-bold text-white transition duration-300 ease-in-out transform bg-primary shadow-md rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ຕັ້ງຄ່າເມນູປະຈຳວັນ
        </button>
      </div>
    </div>
  );
};

export default DailyMenuControl;