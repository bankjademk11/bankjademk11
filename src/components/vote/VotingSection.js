import React from 'react';

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
              
              <p className={`text-lg mb-4 ${isSelected ? 'text-white' : 'text-accent'}`}>ຄະແນນໂຫວດ: {pack.votes}</p>

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
