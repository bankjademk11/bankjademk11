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
          <h3 className="mb-4 text-xl font-semibold text-gray-700">ปิดการโหวต:</h3>
          <button
            onClick={handleCloseVoting}
            className="w-full px-6 py-3 font-bold text-white transition duration-300 ease-in-out transform bg-orange-500 shadow-lg rounded-xl hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
          >
            ปิดการโหวต
          </button>
        </div>
      )}

      {/* Admin Direct Select Food */}
      <div className="pt-4 border-t border-gray-200">
        <h3 className="mb-4 text-xl font-semibold text-gray-700">ตั้งค่าเมนูประจำวันโดยตรง:</h3>
        <select
          value={adminDirectSelectFoodId}
          onChange={(e) => setAdminDirectSelectFoodId(e.target.value)}
          className="block w-full px-4 py-3 mt-1 text-lg border border-gray-300 shadow-sm rounded-xl focus:ring-teal-500 focus:border-teal-500"
        >
          <option value="">-- เลือกเมนู --</option>
          {foodItems.map(food => (
            <option key={food.id} value={food.id}>{food.name}</option>
          ))}
        </select>
        <button
          onClick={handleAdminSetFood}
          disabled={!adminDirectSelectFoodId}
          className="mt-4 w-full px-6 py-3 font-bold text-white transition duration-300 ease-in-out transform bg-purple-600 shadow-lg rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
        >
          ตั้งค่าเมนูประจำวัน
        </button>
      </div>
    </>
  );
};

export default DailyMenuControl;