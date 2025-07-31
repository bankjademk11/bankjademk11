import React, { useState, useEffect } from 'react';

const FoodList = ({ filteredFoodItems, handleEditFood, handleDeleteFood, BACKEND_URL }) => {
  const [averageRatings, setAverageRatings] = useState({});
  const [expandedFoodId, setExpandedFoodId] = useState(null);
  const [foodReviews, setFoodReviews] = useState({});

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

  const handleToggleReviews = async (foodId) => {
    if (expandedFoodId === foodId) {
      setExpandedFoodId(null);
    } else {
      setExpandedFoodId(foodId);
      if (!foodReviews[foodId]) {
        try {
          const response = await fetch(`${BACKEND_URL}/api/foods/${foodId}/reviews`);
          if (response.ok) {
            const data = await response.json();
            setFoodReviews(prevReviews => ({ ...prevReviews, [foodId]: data }));
          } else {
            console.error(`Error fetching reviews for food ${foodId}:`, response.statusText);
          }
        } catch (error) {
          console.error(`Error fetching reviews for food ${foodId}:`, error);
        }
      }
    }
  };

  return (
    <section className="w-full">
      {filteredFoodItems.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-secondary">ບໍ່ພົບເມນູອາຫານທີ່ຄົ້ນຫາ</p>
          <p className="text-md text-gray-400 mt-2">ລອງປ່ຽນຄຳຄົ້ນ ຫຼື ໝວດໝູ່ອື່ນ</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredFoodItems.map((food) => (
            <div key={food.id} className="bg-surface rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 ease-in-out flex flex-col">
              <div className="relative">
                <img
                  src={food.image}
                  alt={food.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => { e.target.onerror = null; e.target.src = `/BG.png`; }}
                />
                <div className="absolute top-2 right-2 bg-accent text-white text-sm font-bold px-3 py-1 rounded-full shadow-md">
                  ★ {averageRatings[food.id] !== undefined ? averageRatings[food.id] : '...'}
                </div>
              </div>

              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-primary mb-2 font-sans truncate">{food.name}</h3>
                <p className="text-secondary text-sm mb-4 flex-grow">{food.tags && food.tags.length > 0 ? food.tags.join(', ') : 'ບໍ່ມີໝວດໝູ່'}</p>
                
                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between space-x-2">
                  <button
                    onClick={() => handleEditFood(food.id)}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white font-semibold rounded-full shadow-md hover:bg-blue-600 transition-colors duration-300"
                  >
                    ແກ້ໄຂ
                  </button>
                  <button
                    onClick={() => handleDeleteFood(food.id)}
                    className="flex-1 px-4 py-2 bg-red-500 text-white font-semibold rounded-full shadow-md hover:bg-red-600 transition-colors duration-300"
                  >
                    ລຶບ
                  </button>
                  <button
                    onClick={() => handleToggleReviews(food.id)}
                    className="flex-1 px-4 py-2 bg-primary text-white font-semibold rounded-full shadow-md hover:bg-opacity-90 transition-colors duration-300"
                  >
                    {expandedFoodId === food.id ? 'ເຊື່ອງຄຳເຫັນ' : 'ເບິ່ງຄຳເຫັນ'}
                  </button>
                </div>
              </div>

              {expandedFoodId === food.id && (
                <div className="p-5 bg-gray-50 border-t border-gray-200">
                  <h4 className="text-lg font-semibold mb-3 text-primary">ຄຳຕິຊົມ</h4>
                  {foodReviews[food.id] && foodReviews[food.id].length > 0 ? (
                    <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                      {foodReviews[food.id].map(review => (
                        <div key={review.id} className="bg-white p-3 rounded-lg shadow-sm">
                          <div className="flex justify-between items-center mb-1">
                            <p className="font-semibold text-primary">ຄະແນນ: {review.rating} / 5</p>
                            <p className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString()}</p>
                          </div>
                          {review.comment && <p className="text-secondary text-sm">{review.comment}</p>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-secondary text-sm">ຍັງບໍ່ມີຄຳເຫັນສຳລັບເມນູນີ້</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default FoodList;