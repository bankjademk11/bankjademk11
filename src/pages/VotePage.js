import React, { useState, useEffect } from 'react';
import {
  VotingSection,
  DailyWinner,
} from '../components';

const VotePage = ({
  userId,
  onVoteFromApp,
  handleReviewSubmit,
  foodItems,
  onCancelVoteFromApp,
}) => {
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const [dailyMenu, setDailyMenu] = useState({ status: 'loading' });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const fetchMenuForDate = async () => {
      if (!selectedDate) return;
      setDailyMenu({ status: 'loading' });
      try {
        const response = await fetch(`${BACKEND_URL}/api/daily-menu/${selectedDate}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDailyMenu(data);
      } catch (error) {
        console.error(`Error fetching menu for ${selectedDate}:`, error);
        setDailyMenu({ status: 'error' });
      }
    };

    fetchMenuForDate();

  }, [BACKEND_URL, selectedDate]);

  const handleVote = async (foodPackIndex) => {
    try {
      const updatedDailyMenu = await onVoteFromApp(foodPackIndex, selectedDate);
      setDailyMenu(updatedDailyMenu);
    } catch (error) {
      console.error("Error voting in VotePage:", error);
    }
  };

  const handleCancelVote = async () => {
    try {
      const updatedDailyMenu = await onCancelVoteFromApp(selectedDate);
      setDailyMenu(updatedDailyMenu);
    } catch (error) {
      console.error("Error canceling vote in VotePage:", error);
    }
  };

  const getWinningFoodDetails = () => {
    if (!dailyMenu || dailyMenu.status === 'loading' || dailyMenu.status === 'error') return null;

    if (dailyMenu.status === 'closed') {
      if (dailyMenu.vote_options && Array.isArray(dailyMenu.vote_options) && dailyMenu.vote_options.length > 0) {
        const totalVotes = dailyMenu.vote_options.reduce((sum, pack) => sum + (pack.votes || 0), 0);
        if (totalVotes > 0) {
          const winningPack = dailyMenu.vote_options.reduce((prev, current) => {
            return (prev.votes > current.votes) ? prev : current;
          });
          return {
            name: winningPack.name,
            foodIds: winningPack.foodIds,
          };
        }
      }
      if (dailyMenu.winning_food_item_id) {
        return foodItems.find(item => item.id === dailyMenu.winning_food_item_id);
      }
      return null;
    }

    if (dailyMenu.status === 'admin_set' && dailyMenu.admin_set_food_item_id) {
      return foodItems.find(item => item.id === dailyMenu.admin_set_food_item_id);
    }

    return null;
  };

  const winningFood = getWinningFoodDetails();

  const renderContent = () => {
    if (dailyMenu.status === 'loading') {
      return <p className="text-center text-xl text-secondary">ກຳລັງໂຫຼດຂໍ້ມູນ...</p>;
    }
    if (dailyMenu.status === 'error') {
      return <p className="text-center text-xl text-red-500">ເກີດຂໍ້ຜິດພາດໃນການໂຫຼດຂໍ້ມູນ.</p>;
    }
    if (!dailyMenu.is_visible) {
      return <p className="text-center text-xl text-secondary">ເມນູສຳລັບວັນທີນີ້ຖືກປິດໃຊ້ງານ.</p>;
    }
    if (dailyMenu.status === 'idle') {
      return <p className="text-center text-xl text-secondary">ຍັງບໍ່ມີການຕັ້ງຄ່າເມນູສຳລັບມື້ນີ້.</p>;
    }
    if (dailyMenu.status === 'voting') {
      return (
        <VotingSection
          dailyMenu={dailyMenu}
          userId={userId}
          handleVote={handleVote}
          foodItems={foodItems}
          onCancelVoteFromApp={handleCancelVote}
        />
      );
    }
    return (
      <DailyWinner
        winningFood={winningFood}
        dailyMenuStatus={dailyMenu.status}
        handleReviewSubmit={handleReviewSubmit}
        userId={userId}
        foodItems={foodItems}
      />
    );
  };

  return (
    <section className="min-h-screen bg-background py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-4xl font-bold text-primary text-center sm:text-left">ເມນູປະຈຳວັນ</h2>
          <div className="flex items-center gap-3">
            <label htmlFor="vote-date-picker" className="font-semibold text-secondary text-lg">ເລືອກວັນທີ:</label>
            <input
              type="date"
              id="vote-date-picker"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-transparent transition-colors"
            />
          </div>
        </div>

        {renderContent()}
      </div>
    </section>
  );
};

export default VotePage;