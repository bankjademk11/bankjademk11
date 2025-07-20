import React from 'react';

const FoodList = ({ filteredFoodItems, handleEditFood, handleDeleteFood }) => {
  return (
    <section className="max-w-6xl mx-auto">
      <h2 className="mb-6 text-3xl font-bold text-center text-teal-700">รายการเมนูอาหารส่วนตัวของคุณ</h2>
      {filteredFoodItems.length === 0 ? (
        <p className="mt-8 text-xl text-center text-gray-600">
          ไม่พบเมนูอาหารในหมวดหมู่นี้ ลองเพิ่มเมนูใหม่ดูสิ!
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredFoodItems.map((food) => (
            <div
              key={food.id}
              className="overflow-hidden transition duration-300 ease-in-out transform bg-white border border-teal-200 shadow-xl rounded-2xl hover:scale-105"
            >
              <img
                src={food.image}
                alt={food.name}
                className="object-cover w-full h-48 rounded-t-2xl"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://placehold.co/400x300/CCCCCC/000000?text=Image+Not+Found`;
                }}
              />
              <div className="p-6">
                <h3 className="mb-3 text-2xl font-semibold text-gray-800">{food.name}</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {food.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm font-medium text-teal-700 bg-teal-100 rounded-full shadow-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => handleEditFood(food.id)}
                    className="px-5 py-2 text-white transition duration-200 ease-in-out bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                  >
                    แก้ไข
                  </button>
                  <button
                    onClick={() => handleDeleteFood(food.id)}
                    className="px-5 py-2 text-white transition duration-200 ease-in-out bg-red-500 rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
                  >
                    ลบ
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default FoodList;