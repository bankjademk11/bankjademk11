import React, { useState, useEffect } from 'react';
import {
  VotingSection,
  DailyWinner,
} from '../components';

const VotePage = ({
  userId,
  onVoteFromApp, // เปลี่ยนชื่อ prop จาก handleVote
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

  // This handleVote will be passed to VotingSection
  const handleVote = async (foodPackIndex) => {
    try {
      const updatedDailyMenu = await onVoteFromApp(foodPackIndex); // Call App.js's handleVote with foodPackIndex
      setDailyMenu(updatedDailyMenu); // Update local state immediately
    } catch (error) {
      // Error handling is done in App.js's handleVote, but we can log here if needed
      console.error("Error voting in VotePage:", error);
    }
  };

  const getWinningFoodDetails = () => {
    if (!dailyMenu || dailyMenu.status === 'loading') return null;

    if (dailyMenu.status === 'closed') {
      // If it's a pack, winning_food_name will be set, and vote_options will contain the pack details
      if (dailyMenu.winning_food_name && dailyMenu.vote_options && dailyMenu.vote_options.length > 0) {
        const winningPack = dailyMenu.vote_options.find(pack => pack.name === dailyMenu.winning_food_name);
        if (winningPack) {
          // Return the pack object with foodIds for image display
          return {
            name: winningPack.name,
            foodIds: winningPack.foodIds,
          };
        }
      }
      // Fallback for individual food if winning_food_item_id is set (e.g., old data or admin set)
      if (dailyMenu.winning_food_item_id) {
        return foodItems.find(item => item.id === dailyMenu.winning_food_item_id);
      }
      // If closed but no winning food/pack found (e.g., no votes, or data inconsistency)
      return null;
    }

    // If admin set a food, find its details
    if (dailyMenu.status === 'admin_set' && dailyMenu.admin_set_food_item_id) {
      return foodItems.find(item => item.id === dailyMenu.admin_set_food_item_id);
    }

    return null;
  };

  const winningFood = getWinningFoodDetails();

  return (
    <section className="max-w-6xl p-8 mx-auto mb-10 bg-white border border-teal-200 shadow-xl rounded-2xl">
      <h2 className="mb-6 text-3xl font-bold text-center text-teal-700">ເມນູປະຈຳວັນ</h2>

      {/* Spoil Vote Button */}
      {tomorrowMenu && tomorrowMenu.status !== 'idle' && (
        <div className="text-center mb-4">
          <button
            onClick={() => setShowSpoilVote(!showSpoilVote)}
            className="px-6 py-3 font-bold text-white transition duration-300 ease-in-out transform bg-blue-500 shadow-lg rounded-xl hover:bg-blue-600 hover:scale-105"
          >
            {showSpoilVote ? 'ເຊື່ອງເມນູມື້ອື່ນ' : 'ເບິ່ງເມນູມື້ອື່ນ (Spoil Vote)'}
          </button>
        </div>
      )}

      {/* Tomorrow's Menu Display */}
      {showSpoilVote && tomorrowMenu && tomorrowMenu.status !== 'idle' && (
        <div className="mb-6 p-4 border rounded-lg bg-blue-50 shadow-lg">
          <h3 className="mb-4 text-xl font-semibold text-blue-800 text-center">ເມນູສຳລັບມື້ອື່ນ:</h3>
          {tomorrowMenu.status === 'voting' && tomorrowMenu.vote_options && tomorrowMenu.vote_options.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {tomorrowMenu.vote_options.map((pack, index) => (
                <div key={index} className="bg-white p-3 rounded-lg shadow-md flex flex-col items-center">
                  {/* Display images for the pack */}
                  <div className="flex space-x-2 mb-2">
                    {pack.foodIds.map(foodId => {
                      const food = foodItems.find(item => item.id === foodId);
                      return food ? (
                        <img
                          key={food.id}
                          src={food.image}
                          alt={food.name}
                          className="w-16 h-16 object-cover rounded-md"
                          onError={(e) => { e.target.onerror = null; e.target.src = `/BG.png`; }}
                        />
                      ) : null;
                    })}
                  </div>
                  <span className="font-medium text-gray-800 text-center">{pack.name}</span>
                </div>
              ))}
            </div>
          ) : tomorrowMenu.status === 'admin_set' && tomorrowMenu.admin_set_food_item_id ? (
            <div className="text-center">
              <p className="text-lg font-semibold text-blue-700">ເມນູທີ່ແອັດມິນເລືອກໄວ້:</p>
              {foodItems.find(item => item.id === tomorrowMenu.admin_set_food_item_id) ? (
                <div className="bg-white p-3 rounded-lg shadow-md inline-flex flex-col items-center mt-2">
                  <img
                    src={foodItems.find(item => item.id === tomorrowMenu.admin_set_food_item_id).image}
                    alt={foodItems.find(item => item.id === tomorrowMenu.admin_set_food_item_id).name}
                    className="w-24 h-24 object-cover rounded-md mb-2"
                    onError={(e) => { e.target.onerror = null; e.target.src = `/BG.png`; }}
                  />
                  <span className="font-medium text-gray-800">{foodItems.find(item => item.id === tomorrowMenu.admin_set_food_item_id).name}</span>
                </div>
              ) : (
                <p className="text-gray-600">ບໍ່ພົບຂໍ້ມູນເມນູ</p>
              )}
            </div>
          ) : (
            <p className="text-center text-gray-600">ຍັງບໍ່ມີເມນູສຳລັບມື້ອື່ນ</p>
          )}
        </div>
      )}

      {dailyMenu.status === 'voting' ? (
        <VotingSection
          dailyMenu={dailyMenu}
          userId={userId}
          handleVote={handleVote}
          foodItems={foodItems} // Pass foodItems to VotingSection to resolve names
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