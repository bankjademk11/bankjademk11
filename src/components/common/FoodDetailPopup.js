import React from 'react';

const FoodDetailPopup = ({ food, reviews, averageRating, onClose, BACKEND_URL }) => {
  if (!food) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl font-bold"
        >
          &times;
        </button>
        <div className="p-6">
          <img
            src={food.image}
            alt={food.name}
            className="w-full h-64 object-cover rounded-lg mb-4"
            onError={(e) => { e.target.onerror = null; e.target.src = `/BG.png`; }}
          />
          <h2 className="text-3xl font-bold text-primary mb-2">{food.name}</h2>
          <p className="text-secondary text-lg mb-4">
            ໝວດໝູ່: {food.tags && food.tags.length > 0 ? food.tags.join(', ') : 'ບໍ່ມີໝວດໝູ່'}
          </p>
          <div className="flex items-center mb-4">
            <span className="text-xl font-bold text-accent mr-2">★ {averageRating !== undefined ? averageRating : '...'}</span>
            <span className="text-gray-600">ຄະແນນສະເລ່ຍ</span>
          </div>

          <h3 className="text-2xl font-semibold text-primary mb-3">ຄຳຕິຊົມ</h3>
          {reviews && reviews.length > 0 ? (
            <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
              {reviews.map(review => (
                <div key={review.id} className="bg-gray-100 p-3 rounded-lg shadow-md">
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-semibold text-primary">ຄະແນນ: {review.rating} / 5</p>
                    <p className="text-xs text-gray-500">{new Date(review.created_at).toLocaleDateString()}</p>
                  </div>
                  {review.comment && <p className="text-secondary text-sm">{review.comment}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-secondary text-sm">ຍັງບໍ່ມີຄຳເຫັນສຳລັບເມນູນີ້</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodDetailPopup;
