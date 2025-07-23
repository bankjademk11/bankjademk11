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

    fetchDailyMenu(); // Initial fetch
    const intervalId = setInterval(fetchDailyMenu, 3000); // Poll every 3 seconds

    return () => clearInterval(intervalId); // Cleanup on component unmount
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
    if (!dailyMenu) return null;

    if (dailyMenu.status === 'closed' && dailyMenu.winning_food_item_id) {
      return foodItems.find(item => item.id === dailyMenu.winning_food_item_id) ||
             dailyMenu.vote_options.find(option => option.foodItemId === dailyMenu.winning_food_item_id);
    } else if (dailyMenu.status === 'admin_set' && dailyMenu.admin_set_food_item_id) {
      return foodItems.find(item => item.id === dailyMenu.admin_set_food_item_id);
    }
    return null;
  };

  const winningFood = getWinningFoodDetails();
  return (
    <section className="max-w-6xl p-8 mx-auto mb-10 bg-white border border-teal-200 shadow-xl rounded-2xl">
      <h2 className="mb-6 text-3xl font-bold text-center text-teal-700">เมนูประจำวัน</h2>
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