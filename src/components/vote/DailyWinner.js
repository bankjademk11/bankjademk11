import React from 'react';

const DailyWinner = ({ winningFood, dailyMenuStatus }) => {
  if (!winningFood) {
    return (
      <p className="text-center text-xl text-gray-600">
        ยังไม่มีการตั้งค่าเมนูประจำวัน หรือกำลังรอแอดมินเริ่มการโหวต
      </p>
    );
  }

  return (
    <div className="text-center">
      <p className="text-2xl font-bold text-teal-700 mb-4">
        เมนูประจำวันนี้คือ:
      </p>
      <div className="bg-teal-50 p-6 rounded-xl shadow-lg inline-block">
        <img
          src={winningFood.image}
          alt={winningFood.name}
          className="w-64 h-48 object-cover rounded-lg mb-4 mx-auto"
          onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x300/CCCCCC/000000?text=Image+Not+Found`; }}
        />
        <h3 className="text-3xl font-extrabold text-teal-800">{winningFood.name}</h3>
        <div className="flex flex-wrap justify-center gap-2 mt-3">
          {winningFood.tags && winningFood.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 text-sm font-medium text-teal-700 bg-teal-200 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      {dailyMenuStatus === 'closed' && (
        <p className="mt-4 text-gray-600">
          (มาจากผลโหวต)
        </p>
      )}
      {dailyMenuStatus === 'admin_set' && (
        <p className="mt-4 text-gray-600">
          (ตั้งค่าโดยแอดมิน)
        </p>
      )}
    </div>
  );
};

export default DailyWinner;