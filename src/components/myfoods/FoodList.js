import React, { useState, useEffect } from 'react';
import FoodDetailPopup from '../common/FoodDetailPopup';

const FoodList = ({ filteredFoodItems, handleEditFood, handleDeleteFood, BACKEND_URL }) => {
  const [averageRatings, setAverageRatings] = useState({});
  const [foodReviews, setFoodReviews] = useState({});
  const [selectedFoodForPopup, setSelectedFoodForPopup] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

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

  const handleCardClick = async (food) => {
    setSelectedFoodForPopup(food);
    setShowPopup(true);
    if (!foodReviews[food.id]) {
      try {
        const response = await fetch(`${BACKEND_URL}/api/foods/${food.id}/reviews`);
        if (response.ok) {
          const data = await response.json();
          setFoodReviews(prevReviews => ({ ...prevReviews, [food.id]: data }));
        } else {
          console.error(`Error fetching reviews for food ${food.id}:`, response.statusText);
        }
      } catch (error) {
        console.error(`Error fetching reviews for food ${food.id}:`, error);
      }
    }
  };

  const handleClosePopup = () => {
    setSelectedFoodForPopup(null);
    setShowPopup(false);
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
            <div key={food.id} className="bg-surface rounded-2xl shadow-xl overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 ease-in-out flex flex-col cursor-pointer" onClick={() => handleCardClick(food)}>
              <div className="relative">
                <img
                  src={food.image}
                  alt={food.name}
                  className="w-full h-48 object-cover rounded-lg"
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
                    onClick={(e) => { e.stopPropagation(); handleEditFood(food.id); }}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white font-semibold rounded-full shadow-md hover:bg-blue-600 transition-colors duration-300"
                  >
                    ແກ້ໄຂ
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteFood(food.id); }}
                    className="flex-1 px-4 py-2 bg-red-500 text-white font-semibold rounded-full shadow-lg hover:bg-red-600 hover:shadow-xl transition-all duration-300"
                  >
                    ລຶບ
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showPopup && (
        <FoodDetailPopup
          food={selectedFoodForPopup}
          reviews={foodReviews[selectedFoodForPopup.id]}
          averageRating={averageRatings[selectedFoodForPopup.id]}
          onClose={handleClosePopup}
          BACKEND_URL={BACKEND_URL}
        />
      )}
    </section>
  );
};

export default FoodList;