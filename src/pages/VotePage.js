import React from 'react';
import {
  VotingSection,
  DailyWinner,
} from '../components';

const VotePage = ({
  dailyMenu,
  userId,
  handleVote,
  handleReviewSubmit,
  foodItems,
  winningFood,
}) => {
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