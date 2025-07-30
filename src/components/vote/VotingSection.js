import React from 'react';

const VotingSection = ({ dailyMenu, userId, handleVote, foodItems, onCancelVoteFromApp }) => {
  const hasVoted = dailyMenu.voted_users && dailyMenu.voted_users[userId] !== undefined; // Check if user has voted for any pack
  const userVotedPackIndex = hasVoted ? dailyMenu.voted_users[userId] : null; // Get the index of the pack the user voted for

  const onVote = (foodPackIndex) => {
    handleVote(foodPackIndex);
  };

  const onCancelVote = async () => {
    try {
      await onCancelVoteFromApp();
      // Optionally update local state if needed, but App.js's onCancelVoteFromApp should handle it
    } catch (error) {
      console.error("Error canceling vote in VotingSection:", error);
    }
  };

  return (
    <div>
      <p className="text-center text-xl mb-4 text-gray-700 font-semibold">
        ກຳລັງເປີດໂຫວດເມນູປະຈຳວັນ!
        {hasVoted ? ' (ທ່ານໂຫວດແລ້ວ)' : ''}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dailyMenu.vote_options && dailyMenu.vote_options.map((pack, index) => {
          // Add defensive checks for pack.foodIds
          if (!pack || !Array.isArray(pack.foodIds) || pack.foodIds.length !== 2) {
            console.warn("Skipping malformed vote option or individual food item:", pack);
            return null; // Skip this item if it's not a valid pack
          }

          // Find food details for each item in the pack
          const food1 = foodItems.find(item => item.id === pack.foodIds[0]);
          const food2 = foodItems.find(item => item.id === pack.foodIds[1]);

          const isSelected = userVotedPackIndex === index; // Check if this pack is the one the user voted for

          return (
            <div key={index} className={`bg-gray-50 p-4 rounded-xl shadow-lg flex flex-col items-center ${isSelected ? 'border-4 border-blue-500' : ''}`}>
              <div className="flex space-x-2 mb-3">
                {food1 && (
                  <img
                    src={food1.image}
                    alt={food1.name}
                    className="w-24 h-24 object-cover rounded-lg"
                    onError={(e) => { e.target.onerror = null; e.target.src = `/BG.png`; }}
                  />
                )}
                {food2 && (
                  <img
                    src={food2.image}
                    alt={food2.name}
                    className="w-24 h-24 object-cover rounded-lg"
                    onError={(e) => { e.target.onerror = null; e.target.src = `/BG.png`; }}
                  />
                )}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">{pack.name}</h3>
              <p className="text-lg text-teal-600 mb-4">ຄະແນນໂຫວດ: {pack.votes}</p>
              <button
                onClick={() => onVote(index)} // Pass the index of the pack
                className={`px-6 py-2 text-white rounded-lg shadow-md transition ${isSelected ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'}`}
              >
                {isSelected ? 'ເລືອກແລ້ວ' : 'ໂຫວດ'}
              </button>
            </div>
          );
        })}
      </div>

      {hasVoted && (
        <div className="text-center mt-6">
          <button
            onClick={onCancelVote}
            className="px-6 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition"
          >
            ຍົກເລີກການໂຫວດ
          </button>
        </div>
      )}
    </div>
  );
};

export default VotingSection;