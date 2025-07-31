import React, { useState, useEffect } from 'react';

const DailyWinner = ({ winningFood, dailyMenuStatus, handleReviewSubmit, userId, foodItems }) => {

  if (!winningFood) {
    return (
      <p className="text-center text-xl text-secondary p-8 bg-surface rounded-2xl shadow-lg">
        ຍັງບໍ່ມີການຕັ້ງຄ່າເມນູປະຈຳວັນ ຫຼື ກຳລັງລໍຖ້າແອັດມິນເລີ່ມການໂຫວດ
      </p>
    );
  }

  return (
    <div className="p-8 bg-surface rounded-2xl shadow-lg text-center">
      <p className="text-3xl font-bold text-primary mb-6">
        {dailyMenuStatus === 'closed' ? 'ເມນູທີ່ຊະນະໃນມື້ນີ້ແມ່ນ:' : 'ເມນູປະຈຳວັນນີ້ແມ່ນ:'}
      </p>

      {/* Display logic for winning pair */}
      {winningFood.foodIds && winningFood.foodIds.length > 0 ? (
        <div className="space-y-8">
          <h3 className="text-4xl font-extrabold text-primary">{winningFood.name}</h3>
          <div className="flex flex-wrap justify-center gap-8">
            {winningFood.foodIds.map(foodId => {
              const food = foodItems.find(item => item.id === foodId);
              if (!food) return null;
              return (
                <div key={food.id} className="bg-background p-8 rounded-xl shadow-lg inline-block">
                  <img
                    src={food.image}
                    alt={food.name}
                    className="w-72 h-56 object-cover rounded-lg mb-6 mx-auto"
                    onError={(e) => { e.target.onerror = null; e.target.src = `/BG.png`; }}
                  />
                  <h4 className="text-3xl font-bold text-primary mb-3">{food.name}</h4>
                  {food.tags && (
                    <div className="flex flex-wrap justify-center gap-3 mt-4">
                      {food.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-4 py-1 text-sm font-medium text-secondary bg-gray-100 rounded-full"
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
        <div className="bg-background p-8 rounded-xl shadow-2xl inline-block">
          <img
            src={winningFood.image}
            alt={winningFood.name}
            className="w-72 h-56 object-cover rounded-lg mb-6 mx-auto"
            onError={(e) => { e.target.onerror = null; e.target.src = `/BG.png`; }}
          />
          <h3 className="text-4xl font-extrabold text-primary mb-3">{winningFood.name}</h3>
          {winningFood.tags && (
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              {winningFood.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-4 py-1 text-sm font-medium text-secondary bg-gray-100 rounded-full"
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
        <p className="mt-6 text-secondary">
          (ມາຈາກຜົນໂຫວດ)
        </p>
      )}
      {dailyMenuStatus === 'admin_set' && (
        <p className="mt-6 text-secondary">
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
          setHasReviewed(false);
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
      setHasReviewed(true);
    } else {
      console.error("handleReviewSubmit prop is not a function!");
    }
  };

  if (isLoading) {
    return <div className="mt-8 h-12"></div>;
  }

  if (hasReviewed) {
    return <p className="mt-8 text-lg text-secondary">ທ່ານໄດ້ຄຳເຫັນເມນູນີ້ແລ້ວ</p>;
  }

  if (showReviewForm) {
    return (
      <div className="mt-8 p-6 bg-background rounded-xl shadow-lg text-left">
        <h4 className="text-2xl font-bold text-center text-primary mb-5">ຄຳເຫັນເມນູ</h4>
        <form onSubmit={onSubmitReview} className="space-y-5">
          <div>
            <label htmlFor={`rating-${foodId}`} className="block text-lg font-medium text-secondary mb-2">ຄະແນນ (1-5):</label>
            <input
              type="number"
              id={`rating-${foodId}`}
              min="1"
              max="5"
              value={reviewRating}
              onChange={(e) => setReviewRating(parseInt(e.target.value))}
              className="block w-full px-4 py-3 mt-1 text-lg border border-gray-300 shadow-sm rounded-lg focus:ring-primary focus:border-transparent transition-colors"
              required
            />
          </div>
          <div>
            <label htmlFor={`comment-${foodId}`} className="block text-lg font-medium text-secondary mb-2">ຄຳເຫັນ (ບໍ່ບັງຄັບ):</label>
            <textarea
              id={`comment-${foodId}`}
              rows="4"
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              className="block w-full px-4 py-3 mt-1 text-lg border border-gray-300 shadow-sm rounded-lg focus:ring-primary focus:border-transparent transition-colors"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full px-6 py-3 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-opacity-90 transition-colors"
          >
            ສົ່ງຄຳເຫັນ
          </button>
          <button
            type="button"
            onClick={() => setShowReviewForm(false)}
            className="w-full px-6 py-3 mt-3 bg-gray-400 text-white font-bold rounded-lg shadow-md hover:bg-gray-500 transition-colors"
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
      className="mt-8 px-8 py-4 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-opacity-90 transition-colors"
    >
      ຄຳເຫັນເມນູນີ້
    </button>
  );
};

export default DailyWinner;
