import React, { useState, useEffect } from 'react';

// Star Icon for Rating Input
const StarIcon = ({ filled, className }) => (
  <svg
    className={`w-8 h-8 cursor-pointer transition-all duration-200 ${className}`}
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
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
        const isFilled = starRating <= (hoverRating || rating);
        return (
          <div
            key={starRating}
            className="relative transform transition-transform duration-200 hover:scale-110"
            onMouseEnter={() => setHoverRating(starRating)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(starRating)}
          >
            <StarIcon
              filled={isFilled}
              className={isFilled ? 'text-accent' : 'text-neutral-300'}
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
      <div className="text-center py-20 bg-neutral-100 rounded-2xl">
        <h3 className="text-2xl font-bold text-neutral-700">ບໍ່ມີເມນູປະຈຳວັນ</h3>
        <p className="text-neutral-500 mt-2">ກະລຸນາລໍຖ້າແອັດມິນຕັ້ງຄ່າເມນູ ຫຼື ເລີ່ມການໂຫວດ</p>
      </div>
    );
  }

  const renderFoodCard = (food) => (
    <div key={food.id} className="bg-surface rounded-2xl shadow-md overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg w-full max-w-sm mx-auto">
        <img
            src={food.image}
            alt={food.name}
            className="w-full h-48 object-cover"
            onError={(e) => { e.target.onerror = null; e.target.src = '/BG.png'; }}
        />
        <div className="p-5">
            <h4 className="text-2xl font-bold text-neutral-800">{food.name}</h4>
            {food.tags && (
                <div className="flex flex-wrap gap-2 mt-3">
                    {food.tags.map((tag, index) => (
                        <span key={index} className="px-3 py-1 text-xs font-medium text-primary-dark bg-primary-light/20 rounded-full">
                            {tag}
                        </span>
                    ))}
                </div>
            )}
            <ReviewButton foodId={food.id} userId={userId} handleReviewSubmit={handleReviewSubmit} />
        </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 bg-white/50 backdrop-blur-lg rounded-3xl shadow-lg text-center animate-fade-in">
      <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-2">
        {dailyMenuStatus === 'closed' ? '🎉 ເມນູທີ່ຊະນະໃນມື້ນີ້ແມ່ນ 🎉' : 'ເມນູປະຈຳມື້ນີ້'}
      </h2>
      <p className="text-neutral-500 mb-8">
        {dailyMenuStatus === 'closed' ? '(ຕັດສິນຈາກຜົນໂຫວດສ່ວນຫຼາຍ)' : '(ຕັ້ງຄ່າໂດຍแอดมิน)'}
      </p>

      {winningFood.foodIds && winningFood.foodIds.length > 0 ? (
        <div className="space-y-8">
          <h3 className="text-4xl md:text-5xl font-bold text-accent-dark">{winningFood.name}</h3>
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            {winningFood.foodIds.map(foodId => {
              const food = foodItems.find(item => item.id === foodId);
              if (!food) return null;
              return renderFoodCard(food);
            })}
          </div>
        </div>
      ) : (
        renderFoodCard(winningFood)
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
    return <div className="mt-6 h-12 w-full bg-neutral-200 rounded-lg animate-pulse"></div>; // Placeholder for loading state
  }

  if (hasReviewed) {
    return <p className="mt-6 text-lg text-success font-medium">✔️ ທ່ານໄດ້ສະແດງຄຳເຫັນແລ້ວ</p>;
  }

  if (showReviewForm) {
    return (
      <div className="mt-6 p-4 bg-neutral-50 rounded-xl text-left animate-fade-in">
        <h4 className="text-lg font-semibold text-center text-neutral-700 mb-4">ໃຫ້ຄະແນນ ແລະ ສະແດງຄຳເຫັນ</h4>
        <form onSubmit={onSubmitReview} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-2 text-center">ຄະແນນ</label>
            <StarRatingInput rating={reviewRating} setRating={setReviewRating} />
          </div>
          <div>
            <label htmlFor={`comment-${foodId}`} className="block text-sm font-medium text-neutral-600 mb-1">ຄຳເຫັນ (ບໍ່ບັງຄັບ)</label>
            <textarea
              id={`comment-${foodId}`}
              rows="3"
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              className="block w-full px-3 py-2 text-base border border-neutral-300 rounded-lg shadow-inner-subtle focus:ring-2 focus:ring-primary-light focus:border-primary-light transition-colors"
            ></textarea>
          </div>
          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setShowReviewForm(false)}
              className="w-full px-4 py-2 bg-neutral-200 text-neutral-700 font-semibold rounded-lg hover:bg-neutral-300 transition-colors"
            >
              ຍົກເລີກ
            </button>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
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
      className="mt-6 w-full px-4 py-3 bg-accent hover:bg-accent-dark text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
    >
      ໃຫ້ຄະແນນເມນູນີ້
    </button>
  );
};

export default DailyWinner;