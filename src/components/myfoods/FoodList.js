import React, { useState, useEffect } from 'react';

const FoodList = ({ filteredFoodItems, handleEditFood, handleDeleteFood, BACKEND_URL }) => {
  const [averageRatings, setAverageRatings] = useState({});

  useEffect(() => {
    const fetchAverageRatings = async () => {
      const newRatings = {};
      for (const food of filteredFoodItems) {
        try {
          const response = await fetch(`${BACKEND_URL}/api/foods/${food.id}/average-rating`);
          if (response.ok) {
            const data = await response.json();
            newRatings[food.id] = data.average_rating || 'N/A';
          } else {
            newRatings[food.id] = 'N/A';
          }
        } catch (error) {
          console.error(`Error fetching average rating for food ${food.id}:`, error);
          newRatings[food.id] = 'N/A';
        }
      }
      setAverageRatings(newRatings);
    };

    if (filteredFoodItems.length > 0 && BACKEND_URL) {
      fetchAverageRatings();
    }
  }, [filteredFoodItems, BACKEND_URL]);

  return (
    <section className="max-w-6xl p-8 mx-auto mb-10 bg-white border border-teal-200 shadow-xl rounded-2xl">
      <h2 className="mb-6 text-3xl font-bold text-center text-teal-700">รายการเมนูอาหาร</h2>
      {filteredFoodItems.length === 0 ? (
        <p className="text-center text-gray-600">ไม่มีเมนูอาหารในรายการ</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFoodItems.map((food) => (
            <div key={food.id} className="bg-gray-50 p-4 rounded-xl shadow-md flex flex-col items-center">
              <img
                src={food.image}
                alt={food.name}
                className="w-full h-32 object-cover rounded-lg mb-3"
                onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x300/CCCCCC/000000?text=Image+Not+Found`; }}
              />
              <h3 className="text-xl font-semibold mb-2">{food.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{food.tags && food.tags.length > 0 ? food.tags.join(', ') : 'ไม่มีแท็ก'}</p>
              <p className="text-lg text-teal-600 mb-4">คะแนนเฉลี่ย: {averageRatings[food.id] !== undefined ? averageRatings[food.id] : 'กำลังโหลด...'}</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditFood(food.id)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600 transition"
                >
                  แก้ไข
                </button>
                <button
                  onClick={() => handleDeleteFood(food.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition"
                >
                  ลบ
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default FoodList;