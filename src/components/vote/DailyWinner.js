import React, { useState, useEffect } from 'react';

const DailyWinner = ({ winningFood, dailyMenuStatus, handleReviewSubmit, userId, foodItems }) => {
  console.log('DailyWinner: handleReviewSubmit prop:', handleReviewSubmit);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5); // Default to 5 stars
  const [reviewComment, setReviewComment] = useState('');
  const [hasReviewed, setHasReviewed] = useState(false);

  // Check if user has already reviewed this specific winningFood
  useEffect(() => {
    const checkReviewStatus = async () => {
      if (winningFood && userId && winningFood.id) {
        try {
          // Assuming you have a way to check if a user has reviewed a food item
          // This might require a new backend endpoint or fetching all reviews
          // For now, we'll simulate or assume a check
          // In a real app, you'd fetch reviews for winningFood.id and check if userId exists
          const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/foods/${winningFood.id}/reviews`);
          if (response.ok) {
            const reviews = await response.json();
            const userReview = reviews.find(review => review.user_id === userId);
            setHasReviewed(!!userReview);
          }
        } catch (error) {
          console.error("Error checking review status:", error);
        }
      }
    };
    checkReviewStatus();
  }, [winningFood, userId]);

  if (!winningFood) {
    return (
      <p className="text-center text-xl text-gray-600">
        ยังไม่มีการตั้งค่าเมนูประจำวัน หรือกำลังรอแอดมินเริ่มการโหวต
      </p>
    );
  }

  const onSubmitReview = (e) => {
    e.preventDefault();
    if (winningFood && winningFood.id) {
      if (typeof handleReviewSubmit === 'function') { // Defensive check
        handleReviewSubmit(winningFood.id, reviewRating, reviewComment);
        setShowReviewForm(false); // Hide form after submission
        setReviewComment(''); // Clear comment
        setReviewRating(5); // Reset rating
        setHasReviewed(true); // Mark as reviewed after submission
      } else {
        console.error("handleReviewSubmit prop is not a function!");
        // Optionally show a user-friendly error message
      }
    }
  };

  return (
    <div className="text-center">
      <p className="text-2xl font-bold text-teal-700 mb-4">
        เมนูประจำวันนี้คือ:
      </p>
      <div className="bg-teal-50 p-6 rounded-xl shadow-2xl inline-block">
        <img
          src={winningFood.image}
          alt={winningFood.name}
          className="w-64 h-48 object-cover rounded-lg mb-4 mx-auto"
          onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x300/CCCCCC/000000?text=Image+Not+Found`; }}
        />
        <h3 className="text-3xl font-extrabold text-teal-800">{winningFood.name}</h3>
        <div className="flex flex-wrap justify-center gap-2 mt-3">
          {winningFood.tags && winningFood.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 text-sm font-medium text-teal-700 bg-teal-200 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      {dailyMenuStatus === 'closed' && (
        <p className="mt-4 text-gray-600">
          (มาจากผลโหวต)
        </p>
      )}
      {dailyMenuStatus === 'admin_set' && (
        <p className="mt-4 text-gray-600">
          (ตั้งค่าโดยแอดมิน)
        </p>
      )}

      {winningFood && !hasReviewed && (
        <button
          onClick={() => setShowReviewForm(true)}
          className="mt-6 px-6 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition"
        >
          รีวิวเมนูนี้
        </button>
      )}

      {hasReviewed && (
        <p className="mt-6 text-lg text-gray-600">คุณได้รีวิวเมนูนี้แล้ว</p>
      )}

      {showReviewForm && winningFood && (
        <div className="mt-8 p-6 bg-white rounded-xl shadow-lg">
          <h3 className="text-2xl font-bold text-center text-teal-700 mb-4">รีวิวเมนู {winningFood.name}</h3>
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
            <button
              type="button"
              onClick={() => setShowReviewForm(false)}
              className="w-full px-4 py-2 mt-2 bg-gray-400 text-white font-semibold rounded-md shadow-md hover:bg-gray-500 transition"
            >
              ยกเลิก
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default DailyWinner;