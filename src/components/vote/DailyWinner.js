import React, { useState, useEffect } from 'react';

const DailyWinner = ({ winningFood, dailyMenuStatus, handleReviewSubmit, userId, foodItems }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5); // Default to 5 stars
  const [reviewComment, setReviewComment] = useState('');
  const [hasReviewed, setHasReviewed] = useState(false);

  // Check if user has already reviewed this specific winningFood
  useEffect(() => {
    const checkReviewStatus = async () => {
      // Only check review status if winningFood is an individual food item (has an ID)
      if (winningFood && userId && winningFood.id) {
        try {
          const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/foods/${winningFood.id}/reviews`);
          if (response.ok) {
            const reviews = await response.json();
            const userReview = reviews.find(review => review.user_id === userId);
            setHasReviewed(!!userReview);
          }
        } catch (error) {
          console.error("Error checking review status:", error);
        }
      } else {
        // If it's a pack, or no winningFood, assume no review is possible for now
        setHasReviewed(true); // Disable review form for packs
      }
    };
    checkReviewStatus();
  }, [winningFood, userId]);

  if (!winningFood) {
    return (
      <p className="text-center text-xl text-gray-600">
        ຍັງບໍ່ມີການຕັ້ງຄ່າເມນູປະຈຳວັນ ຫຼື ກຳລັງລໍຖ້າແອັດມິນເລີ່ມການໂຫວດ
      </p>
    );
  }

  const onSubmitReview = (e) => {
    e.preventDefault();
    // Only allow review submission for individual food items
    if (winningFood && winningFood.id) {
      if (typeof handleReviewSubmit === 'function') {
        handleReviewSubmit(winningFood.id, reviewRating, reviewComment);
        setShowReviewForm(false);
        setReviewComment('');
        setReviewRating(5);
        setHasReviewed(true);
      } else {
        console.error("handleReviewSubmit prop is not a function!");
      }
    }
  };

  return (
    <div className="text-center">
      <p className="text-2xl font-bold text-teal-700 mb-4">
        ເມນູປະຈຳວັນນີ້ແມ່ນ:
      </p>
      <div className="bg-teal-50 p-6 rounded-xl shadow-2xl inline-block">
        {winningFood.foodIds && winningFood.foodIds.length === 2 ? (
          // Display for food pack
          <div className="flex justify-center space-x-4 mb-4">
            {winningFood.foodIds.map(foodId => {
              const food = foodItems.find(item => item.id === foodId);
              return food ? (
                <img
                  key={food.id}
                  src={food.image}
                  alt={food.name}
                  className="w-32 h-24 object-cover rounded-lg"
                  onError={(e) => { e.target.onerror = null; e.target.src = `/BG.png`; }}
                />
              ) : null;
            })}
          </div>
        ) : (
          // Display for individual food
          <img
            src={winningFood.image}
            alt={winningFood.name}
            className="w-64 h-48 object-cover rounded-lg mb-4 mx-auto"
            onError={(e) => { e.target.onerror = null; e.target.src = `/BG.png`; }}
          />
        )}
        <h3 className="text-3xl font-extrabold text-teal-800">{winningFood.name}</h3>
        {winningFood.tags && (
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            {winningFood.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 text-sm font-medium text-teal-700 bg-teal-200 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      {dailyMenuStatus === 'closed' && (
        <p className="mt-4 text-gray-600">
          (ມາຈາກຜົນໂຫວດ)
        </p>
      )}
      {dailyMenuStatus === 'admin_set' && (
        <p className="mt-4 text-gray-600">
          (ຕັ້ງຄ່າໂດຍແອັດມິນ)
        </p>
      )}

      {winningFood && winningFood.id && !hasReviewed && (
        <button
          onClick={() => setShowReviewForm(true)}
          className="mt-6 px-6 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition"
        >
          ຄຳເຫັນເມນູນີ້
        </button>
      )}

      {hasReviewed && winningFood.id && (
        <p className="mt-6 text-lg text-gray-600">ທ່ານໄດ້ຄຳເຫັນເມນູນີ້ແລ້ວ</p>
      )}

      {showReviewForm && winningFood && winningFood.id && (
        <div className="mt-8 p-6 bg-white rounded-xl shadow-lg">
          <h3 className="text-2xl font-bold text-center text-teal-700 mb-4">ຄຳເຫັນເມນູ {winningFood.name}</h3>
          <form onSubmit={onSubmitReview} className="space-y-4">
            <div>
              <label htmlFor="rating" className="block text-lg font-medium text-gray-700">ຄະແນນ (1-5):</label>
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
              <label htmlFor="comment" className="block text-lg font-medium text-gray-700">ຄຳເຫັນ (ບໍ່ບັງຄັບ):</label>
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
              ສົ່ງຄຳເຫັນ
            </button>
            <button
              type="button"
              onClick={() => setShowReviewForm(false)}
              className="w-full px-4 py-2 mt-2 bg-gray-400 text-white font-semibold rounded-md shadow-md hover:bg-gray-500 transition"
            >
              ຍົກເລີກ
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default DailyWinner;
