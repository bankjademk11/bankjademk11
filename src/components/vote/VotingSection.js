import React, { useState } from 'react';

const VotingSection = ({ dailyMenu, userId, handleVote, handleReviewSubmit, foodItems }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5); // Default to 5 stars
  const [reviewComment, setReviewComment] = useState('');
  const [votedFoodId, setVotedFoodId] = useState(null);

  const hasVoted = dailyMenu.votedUsers && dailyMenu.votedUsers[userId];

  const onVote = (foodItemId) => {
    handleVote(foodItemId);
    setVotedFoodId(foodItemId);
    setShowReviewForm(true);
  };

  const onSubmitReview = (e) => {
    e.preventDefault();
    if (votedFoodId) {
      handleReviewSubmit(votedFoodId, reviewRating, reviewComment);
      setShowReviewForm(false); // Hide form after submission
      setReviewComment(''); // Clear comment
      setReviewRating(5); // Reset rating
    }
  };

  const votedFood = foodItems.find(item => item.id === votedFoodId);

  return (
    <div>
      <p className="text-center text-xl mb-4 text-gray-700 font-semibold">
        กำลังเปิดโหวตเมนูประจำวัน!
        {hasVoted ? ' (คุณโหวตแล้ว)' : ''}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dailyMenu.voteOptions.map((option) => (
          <div key={option.foodItemId} className="bg-gray-50 p-4 rounded-xl shadow-lg flex flex-col items-center">
            <img
              src={option.image}
              alt={option.name}
              className="w-full h-32 object-cover rounded-lg mb-3"
              onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x300/CCCCCC/000000?text=Image+Not+Found`; }}
            />
            <h3 className="text-xl font-semibold mb-2">{option.name}</h3>
            <p className="text-lg text-teal-600 mb-4">คะแนนโหวต: {option.votes}</p>
            <button
              onClick={() => onVote(option.foodItemId)}
              disabled={hasVoted}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              โหวต
            </button>
          </div>
        ))}
      </div>

      {hasVoted && showReviewForm && votedFood && (
        <div className="mt-8 p-6 bg-white rounded-xl shadow-lg">
          <h3 className="text-2xl font-bold text-center text-teal-700 mb-4">รีวิวเมนู {votedFood.name}</h3>
          <form onSubmit={onSubmitReview} className="space-y-4">
            <div>
              <label htmlFor="rating" className="block text-lg font-medium text-gray-700">คะแนน (1-5):</label>
              <input
                type="number"
                id="rating"
                min="1"
                max="5"
                value={reviewRating}
                onChange={(e) => setReviewRating(parseInt(e.target.value))}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                required
              />
            </div>
            <div>
              <label htmlFor="comment" className="block text-lg font-medium text-gray-700">ความคิดเห็น (ไม่บังคับ):</label>
              <textarea
                id="comment"
                rows="3"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-teal-600 text-white font-semibold rounded-md shadow-md hover:bg-teal-700 transition"
            >
              ส่งรีวิว
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default VotingSection;