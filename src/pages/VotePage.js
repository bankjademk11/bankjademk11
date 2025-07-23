import React, { useState, useEffect } from 'react';
import {
  VotingSection,
  DailyWinner,
} from '../components';

const VotePage = ({
  userId,
  handleReviewSubmit,
  foodItems,
}) => {
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const [dailyMenu, setDailyMenu] = useState({ status: 'loading' });
  const [showSpoilVote, setShowSpoilVote] = useState(false);
  const [tomorrowMenu, setTomorrowMenu] = useState(null);

  useEffect(() => {
    const fetchDailyMenu = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/daily-menu`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDailyMenu(data);
      } catch (error) {
        console.error("Error fetching daily menu:", error);
      }
    };

    const fetchTomorrowMenu = async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowDateString = tomorrow.toISOString().split('T')[0];
      try {
        const response = await fetch(`${BACKEND_URL}/api/daily-menu/${tomorrowDateString}`);
        if (response.status === 404) {
          setTomorrowMenu(null); // No menu set for tomorrow
          return;
        }
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTomorrowMenu(data);
      } catch (error) {
        console.error("Error fetching tomorrow's menu:", error);
        setTomorrowMenu(null);
      }
    };

    fetchDailyMenu(); // Initial fetch for today's menu
    fetchTomorrowMenu(); // Initial fetch for tomorrow's menu

    const intervalId = setInterval(fetchDailyMenu, 3000); // Poll every 3 seconds for today's menu
    const tomorrowIntervalId = setInterval(fetchTomorrowMenu, 5000); // Poll every 5 seconds for tomorrow's menu

    return () => {
      clearInterval(intervalId);
      clearInterval(tomorrowIntervalId);
    }; // Cleanup on component unmount
  }, [BACKEND_URL]);

  const handleVote = async (foodItemId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/daily-menu/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, foodItemId }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to vote');
      }
      const data = await response.json();
      setDailyMenu(data);
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  const getWinningFoodDetails = () => {
    if (!dailyMenu || dailyMenu.status === 'loading') return null;

    const foodIdToFind = dailyMenu.status === 'closed' ? dailyMenu.winning_food_item_id : dailyMenu.admin_set_food_item_id;

    if (foodIdToFind) {
      return foodItems.find(item => item.id === foodIdToFind);
    }

    // If status is 'closed' but no winning_food_item_id (e.g., no votes)
    // Or if status is 'voting' and we need to show vote options
    if (dailyMenu.status === 'voting' && dailyMenu.vote_options && dailyMenu.vote_options.length > 0) {
      // For voting, we might want to return the options themselves or null if not applicable
      return null; // Or return dailyMenu.vote_options if you want to display them here
    }

    return null;
  };

  const winningFood = getWinningFoodDetails();

  return (
    <section className="max-w-6xl p-8 mx-auto mb-10 bg-white border border-teal-200 shadow-xl rounded-2xl">
      <h2 className="mb-6 text-3xl font-bold text-center text-teal-700">เมนูประจำวัน</h2>

      {/* Spoil Vote Button */}
      {tomorrowMenu && tomorrowMenu.status !== 'idle' && (
        <div className="text-center mb-4">
          <button
            onClick={() => setShowSpoilVote(!showSpoilVote)}
            className="px-6 py-3 font-bold text-white transition duration-300 ease-in-out transform bg-blue-500 shadow-lg rounded-xl hover:bg-blue-600 hover:scale-105"
          >
            {showSpoilVote ? 'ซ่อนเมนูวันพรุ่งนี้' : 'ดูเมนูวันพรุ่งนี้ (Spoil Vote)'}
          </button>
        </div>
      )}

      {/* Tomorrow's Menu Display */}
      {showSpoilVote && tomorrowMenu && tomorrowMenu.status !== 'idle' && (
        <div className="mb-6 p-4 border rounded-lg bg-blue-50 shadow-lg">
          <h3 className="mb-4 text-xl font-semibold text-blue-800 text-center">เมนูสำหรับวันพรุ่งนี้:</h3>
          {tomorrowMenu.status === 'voting' && tomorrowMenu.vote_options && tomorrowMenu.vote_options.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {tomorrowMenu.vote_options.map(food => (
                <div key={food.foodItemId} className="bg-white p-3 rounded-lg shadow-md flex flex-col items-center">
                  <img
                    src={food.image}
                    alt={food.name}
                    className="w-24 h-24 object-cover rounded-md mb-2"
                    onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x300/CCCCCC/000000?text=NF`; }}
                  />
                  <span className="font-medium text-gray-800 text-center">{food.name}</span>
                </div>
              ))}
            </div>
          ) : tomorrowMenu.status === 'admin_set' && tomorrowMenu.admin_set_food_item_id ? (
            <div className="text-center">
              <p className="text-lg font-semibold text-blue-700">เมนูที่แอดมินเลือกไว้:</p>
              {foodItems.find(item => item.id === tomorrowMenu.admin_set_food_item_id) ? (
                <div className="bg-white p-3 rounded-lg shadow-md inline-flex flex-col items-center mt-2">
                  <img
                    src={foodItems.find(item => item.id === tomorrowMenu.admin_set_food_item_id).image}
                    alt={foodItems.find(item => item.id === tomorrowMenu.admin_set_food_item_id).name}
                    className="w-24 h-24 object-cover rounded-md mb-2"
                    onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x300/CCCCCC/000000?text=NF`; }}
                  />
                  <span className="font-medium text-gray-800">{foodItems.find(item => item.id === tomorrowMenu.admin_set_food_item_id).name}</span>
                </div>
              ) : (
                <p className="text-gray-600">ไม่พบข้อมูลเมนู</p>
              )}
            </div>
          ) : (
            <p className="text-center text-gray-600">ยังไม่มีเมนูสำหรับวันพรุ่งนี้</p>
          )}
        </div>
      )}

      {dailyMenu.status === 'voting' ? (
        <VotingSection
          dailyMenu={dailyMenu}
          userId={userId}
          handleVote={handleVote}
          handleReviewSubmit={handleReviewSubmit}
          foodItems={foodItems}
        />
      ) : (
        <DailyWinner
          winningFood={winningFood}
          dailyMenuStatus={dailyMenu.status}
          handleReviewSubmit={handleReviewSubmit}
          userId={userId}
          foodItems={foodItems}
        />
      )}
    </section>
  );
};

export default VotePage;