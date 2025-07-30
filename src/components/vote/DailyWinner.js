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
        {dailyMenuStatus === 'closed' ? 'ເມນູທີ່ຊະນະໃນມື້ນີ້ແມ່ນ:' : 'ເມນູປະຈຳວັນນີ້ແມ່ນ:'}
      </p>

      {/* Display logic for winning pair */}
      {winningFood.foodIds && winningFood.foodIds.length > 0 ? (
        <div className="space-y-6">
          <h3 className="text-3xl font-extrabold text-teal-800">{winningFood.name}</h3>
          <div className="flex flex-wrap justify-center gap-6">
            {winningFood.foodIds.map(foodId => {
              const food = foodItems.find(item => item.id === foodId);
              if (!food) return null;
              return (
                <div key={food.id} className="bg-teal-50 p-6 rounded-xl shadow-2xl inline-block">
                  <img
                    src={food.image}
                    alt={food.name}
                    className="w-64 h-48 object-cover rounded-lg mb-4 mx-auto"
                    onError={(e) => { e.target.onerror = null; e.target.src = `/BG.png`; }}
                  />
                  <h4 className="text-2xl font-bold text-teal-800">{food.name}</h4>
                  {food.tags && (
                    <div className="flex flex-wrap justify-center gap-2 mt-3">
                      {food.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-sm font-medium text-teal-700 bg-teal-200 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <ReviewButton foodId={food.id} userId={userId} handleReviewSubmit={handleReviewSubmit} />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        // Display logic for single food (admin_set or old data)
        <div className="bg-teal-50 p-6 rounded-xl shadow-2xl inline-block">
          <img
            src={winningFood.image}
            alt={winningFood.name}
            className="w-64 h-48 object-cover rounded-lg mb-4 mx-auto"
            onError={(e) => { e.target.onerror = null; e.target.src = `/BG.png`; }}
          />
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
          <ReviewButton foodId={winningFood.id} userId={userId} handleReviewSubmit={handleReviewSubmit} />
        </div>
      )}

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
    </div>
  );
};

// Helper component for the review button and form
const ReviewButton = ({ foodId, userId, handleReviewSubmit }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [hasReviewed, setHasReviewed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkReviewStatus = async () => {
      if (!foodId || !userId) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/foods/${foodId}/reviews`);
        if (response.ok) {
          const reviews = await response.json();
          const userReview = reviews.find(review => review.user_id === userId);
          setHasReviewed(!!userReview);
        } else {
          setHasReviewed(false); // Assume not reviewed if check fails
        }
      } catch (error) {
        console.error("Error checking review status:", error);
        setHasReviewed(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkReviewStatus();
  }, [foodId, userId]);

  const onSubmitReview = (e) => {
    e.preventDefault();
    if (typeof handleReviewSubmit === 'function') {
      handleReviewSubmit(foodId, reviewRating, reviewComment);
      setShowReviewForm(false);
      setHasReviewed(true); // Optimistically set to true
    } else {
      console.error("handleReviewSubmit prop is not a function!");
    }
  };

  if (isLoading) {
    return <div className="mt-6 h-10"></div>; // Placeholder for loading state
  }

  if (hasReviewed) {
    return <p className="mt-6 text-lg text-gray-600">ທ່ານໄດ້ຄຳເຫັນເມນູນີ້ແລ້ວ</p>;
  }

  if (showReviewForm) {
    return (
      <div className="mt-8 p-6 bg-white rounded-xl shadow-lg text-left">
        <h4 className="text-xl font-bold text-center text-teal-700 mb-4">ຄຳເຫັນເມນູ</h4>
        <form onSubmit={onSubmitReview} className="space-y-4">
          <div>
            <label htmlFor={`rating-${foodId}`} className="block text-lg font-medium text-gray-700">ຄະແນນ (1-5):</label>
            <input
              type="number"
              id={`rating-${foodId}`}
              min="1"
              max="5"
              value={reviewRating}
              onChange={(e) => setReviewRating(parseInt(e.target.value))}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
              required
            />
          </div>
          <div>
            <label htmlFor={`comment-${foodId}`} className="block text-lg font-medium text-gray-700">ຄຳເຫັນ (ບໍ່ບັງຄັບ):</label>
            <textarea
              id={`comment-${foodId}`}
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
    );
  }

  return (
    <button
      onClick={() => setShowReviewForm(true)}
      className="mt-6 px-6 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition"
    >
      ຄຳເຫັນເມນູນີ້
    </button>
  );
};
};

export default DailyWinner;
