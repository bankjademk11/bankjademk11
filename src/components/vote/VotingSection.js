import React from 'react';

// SVG Star Icon Component
const StarIcon = ({ filled, className }) => (
  <svg
    className={`w-6 h-6 ${filled ? 'text-yellow-400' : 'text-gray-300'} ${className}`}
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

// Star Rating Display Component
const StarRating = ({ votes }) => {
  // Simple logic: 1 vote = 1 star, up to a max of 5 for display
  const totalStars = 5;
  const filledStars = Math.min(votes, totalStars); // Ensure we don't exceed 5 stars

  return (
    <div className="flex items-center">
      <span className="text-lg mr-2">ຄະແນນໂຫວດ:</span>
      <div className="flex">
        {[...Array(totalStars)].map((_, i) => (
          <StarIcon key={i} filled={i < filledStars} />
        ))}
      </div>
    </div>
  );
};

const VotingSection = ({ dailyMenu, userId, handleVote, foodItems, onCancelVoteFromApp }) => {
  const hasVoted = dailyMenu.voted_users && dailyMenu.voted_users[userId] !== undefined;
  const userVotedPackIndex = hasVoted ? dailyMenu.voted_users[userId] : null;

  const onVote = (foodPackIndex) => {
    handleVote(foodPackIndex);
  };

  const onCancelVote = async () => {
    try {
      await onCancelVoteFromApp();
    } catch (error) {
      console.error("Error canceling vote in VotingSection:", error);
    }
  };

  return (
    <div className="p-6 bg-surface rounded-2xl shadow-lg">
      <p className="text-center text-3xl mb-6 text-primary font-bold">
        ກຳລັງເປີດໂຫວດເມນູປະຈຳວັນ!
        {hasVoted ? ' (ທ່ານໂຫວດແລ້ວ)' : ''}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dailyMenu.vote_options && dailyMenu.vote_options.map((pack, index) => {
          if (!pack || !Array.isArray(pack.foodIds) || pack.foodIds.length === 0) {
            console.warn("Skipping malformed vote option or empty food item:", pack);
            return null;
          }

          const foodsInPack = pack.foodIds.map(foodId => foodItems.find(item => item.id === foodId)).filter(Boolean);

          const isSelected = userVotedPackIndex === index;

          return (
            <div key={index} className={`p-6 rounded-xl shadow-md flex flex-col items-center transition-all duration-300 ease-in-out
              ${isSelected ? 'bg-primary text-white transform scale-105' : 'bg-background border border-gray-200 hover:shadow-lg'}
            `}>
              <div className="flex space-x-3 mb-4">
                {foodsInPack.map(food => (
                  <img
                    key={food.id}
                    src={food.image}
                    alt={food.name}
                    className="w-28 h-28 object-cover rounded-lg shadow-sm"
                    onError={(e) => { e.target.onerror = null; e.target.src = `/BG.png`; }}
                  />
                ))}
              </div>
              <h3 className={`text-2xl font-semibold mb-2 text-center ${isSelected ? 'text-white' : 'text-primary'}`}>{pack.name}</h3>
              
              {/* Replace numeric votes with StarRating component */}
              <div className={`mb-4 ${isSelected ? 'text-white' : 'text-accent'}`}>
                <StarRating votes={pack.votes} />
              </div>

              <button
                onClick={() => onVote(index)}
                className={`px-6 py-3 font-bold text-white rounded-lg shadow-md transition-all duration-300 ease-in-out w-full
                  ${isSelected ? 'bg-green-500 hover:bg-green-600' : 'bg-primary hover:bg-opacity-90'}
                  ${hasVoted && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}
                `}>
                {isSelected ? 'ເລືອກແລ້ວ' : 'ໂຫວດ'}
              </button>
            </div>
          );
        })}
      </div>

      {hasVoted && (
        <div className="text-center mt-8">
          <button
            onClick={onCancelVote}
            className="px-8 py-4 bg-red-500 text-white font-bold rounded-lg shadow-md hover:bg-red-600 transition-colors"
          >
            ຍົກເລີກການໂຫວດ
          </button>
        </div>
      )}
    </div>
  );
};

export default VotingSection;
