import React, { useState, useEffect } from 'react';

// Star Icon for Rating Input
const StarIcon = ({ filled, onClick, onMouseEnter, onMouseLeave }) => (
  <svg
    className={`w-8 h-8 cursor-pointer transition-colors duration-200`}
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.904c.969 0 1.371 1.24.588 1.81l-3.968 2.88a1 1 0 00-.364 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.968-2.88a1 1 0 00-1.175 0l-3.968 2.88c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.364-1.118L2.05 10.1c-.783-.57-.38-1.81.588-1.81h4.904a1 1 0 00.95-.69L11.049 2.927z"
    />
  </svg>
);

// Interactive Star Rating Component for reviews
const StarRatingInput = ({ rating, setRating }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex justify-center items-center space-x-1">
      {[...Array(5)].map((_, index) => {
        const starRating = index + 1;
        return (
          <div
            key={starRating}
            className="relative"
            onMouseEnter={() => setHoverRating(starRating)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(starRating)}
          >
            <StarIcon
              filled={starRating <= (hoverRating || rating)}
              className={starRating <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-300'}
            />
          </div>
        );
      })}
    </div>
  );
};

const DailyWinner = ({ winningFood, dailyMenuStatus, handleReviewSubmit, userId, foodItems }) => {

  if (!winningFood) {
    return (
      <div className="text-center p-8 bg-gray-100 bg-opacity-90 rounded-xl shadow-medium">
        <h3 className="text-2xl font-bold text-primary">ບໍ່ມີເມນູປະຈຳວັນ</h3>
        <p className="text-secondary mt-2">ກະລຸນາລໍຖ້າແອັດມິນຕັ້ງຄ່າເມນູ ຫຼື ເລີ່ມການໂຫວດ</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 bg-opacity-90 rounded-xl shadow-soft text-center">
      <h2 className="text-3xl font-bold text-primary mb-2">
        {dailyMenuStatus === 'closed' ? '🎉 ເມນູທີ່ຊະນະໃນມື້ນີ້ແມ່ນ 🎉' : 'เมนูประจำวันนี้'}
      </h2>
      <p className="text-secondary mb-6">
        {dailyMenuStatus === 'closed' ? '(ມາຈາກຜົນໂຫວດ)' : '(ຕັ້ງຄ່າໂດຍແອັດມິນ)'}
      </p>

      {winningFood.foodIds && winningFood.foodIds.length > 0 ? (
        <div className="space-y-6">
          <h3 className="text-4xl font-bold text-accent">{winningFood.name}</h3>
          <div className="flex flex-wrap justify-center gap-6">
            {winningFood.foodIds.map(foodId => {
              const food = foodItems.find(item => item.id === foodId);
              if (!food) return null;
              return (
                <div key={food.id} className="bg-gray-100 bg-opacity-90 p-6 rounded-xl shadow-soft max-w-sm">
                  <img
                    src={food.image}
                    alt={food.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                    onError={(e) => { e.target.onerror = null; e.target.src = `/BG.png`; }}
                  />
                  <h4 className="text-2xl font-bold text-primary">{food.name}</h4>
                  {food.tags && (
                    <div className="flex flex-wrap justify-center gap-2 mt-3">
                      {food.tags.map((tag, index) => (
                        <span key={index} className="px-3 py-1 text-xs font-medium text-secondary bg-gray-100 rounded-full">
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
        <div className="bg-gray-100 bg-opacity-90 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 inline-block max-w-sm">
          <img
            src={winningFood.image}
            alt={winningFood.name}
            className="w-full h-48 object-cover rounded-lg mb-4"
            onError={(e) => { e.target.onerror = null; e.target.src = `/BG.png`; }}
          />
          <h3 className="text-3xl font-bold text-primary">{winningFood.name}</h3>
          {winningFood.tags && (
            <div className="flex flex-wrap justify-center gap-2 mt-3">
              {winningFood.tags.map((tag, index) => (
                <span key={index} className="px-3 py-1 text-xs font-medium text-secondary bg-gray-100 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
          <ReviewButton foodId={winningFood.id} userId={userId} handleReviewSubmit={handleReviewSubmit} />
        </div>
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
    return <div className="mt-6 h-10"></div>; // Placeholder for loading state
  }

  if (hasReviewed) {
    return <p className="mt-6 text-lg text-success font-medium">✔️ ທ່ານໄດ້ສະແດງຄຳເຫັນແລ້ວ</p>;
  }

  if (showReviewForm) {
    return (
      <div className="mt-6 p-4 bg-gray-50 rounded-lg text-left">
        <h4 className="text-lg font-semibold text-center text-primary mb-4">ໃຫ້ຄະແນນ ແລະ ສະແດງຄຳເຫັນ</h4>
        <form onSubmit={onSubmitReview} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary mb-2 text-center">ຄະແນນ</label>
            <StarRatingInput rating={reviewRating} setRating={setReviewRating} />
          </div>
          <div>
            <label htmlFor={`comment-${foodId}`} className="block text-sm font-medium text-secondary mb-1">ຄຳເຫັນ (ບໍ່ບັງຄັບ)</label>
            <textarea
              id={`comment-${foodId}`}
              rows="3"
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              className="block w-full px-3 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary transition-colors"
            ></textarea>
          </div>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setShowReviewForm(false)}
              className="w-full px-4 py-2 bg-gray-200 text-secondary font-semibold rounded-md hover:bg-gray-300 transition-colors"
            >
              ຍົກເລີກ
            </button>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-primary text-white font-bold rounded-md shadow-md hover:bg-opacity-90 hover:shadow-lg transition-all duration-300"
            >
              ສົ່ງຄຳເຫັນ
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowReviewForm(true)}
      className="mt-6 w-full px-4 py-2 bg-accent text-white font-bold rounded-md shadow-lg hover:bg-opacity-90 hover:shadow-xl transition-all duration-300"
    >
      ໃຫ້ຄະແນນເມນູນີ້
    </button>
  );
};

export default DailyWinner;