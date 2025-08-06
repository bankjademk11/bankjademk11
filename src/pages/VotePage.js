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
      return (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-light mx-auto"></div>
          <p className="mt-4 text-lg text-neutral-500">ກຳລັງໂຫຼດຂໍ້ມູນ...</p>
        </div>
      );
    }
    if (dailyMenu.status === 'error') {
      return (
        <div className="text-center py-20 bg-danger/10 rounded-2xl">
          <p className="text-xl text-danger">ເກີດຂໍ້ຜິດພາດ</p>
          <p className="text-neutral-500 mt-2">ບໍ່ສາມາດໂຫຼດຂໍ້ມູນເມນູໄດ້, ກະລຸນາລອງໃໝ່ອີກຄັ້ງ.</p>
        </div>
      );
    }
    if (!dailyMenu.is_visible) {
      return (
        <div className="text-center py-20 bg-neutral-100 rounded-2xl">
           <p className="text-xl text-neutral-700">ເມນູສຳລັບວັນທີນີ້ຖືກປິດໃຊ້ງານ.</p>
        </div>
      );
    }
    if (dailyMenu.status === 'idle') {
      return (
        <div className="text-center py-20 bg-neutral-100 rounded-2xl">
          <p className="text-xl text-neutral-700">ຍັງບໍ່ມີການຕັ້ງຄ່າເມນູສຳລັບມື້ນີ້.</p>
        </div>
      );
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
    <main className="py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-800">ເມນູປະຈຳວັນ</h1>
            <p className="mt-2 text-lg text-neutral-500">ເລືອກເມນູທີ່ທ່ານຕ້ອງການຮັບປະທານໃນມື້ນີ້</p>
          </div>
          <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-subtle border border-neutral-200">
            <label htmlFor="vote-date-picker" className="font-semibold text-neutral-600 text-md pl-2">ວັນທີ:</label>
            <input
              type="date"
              id="vote-date-picker"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="p-2 border-none rounded-lg text-primary-dark font-semibold focus:ring-2 focus:ring-primary-light transition-all duration-300 w-full md:w-auto"
            />
          </div>
        </div>

        <div className="animate-fade-in">
          {renderContent()}
        </div>
      </div>
    </main>
  );
};

export default VotePage;