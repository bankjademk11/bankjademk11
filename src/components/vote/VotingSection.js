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
    <div className="p-6 bg-surface rounded-xl shadow-soft">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-primary">ໂຫວດເມນູປະຈຳວັນ</h2>
        <p className="text-secondary mt-1">ເລືອກຊຸດອາຫານທີ່ທ່ານຕ້ອງການ</p>
        {hasVoted && <p className='text-success font-medium mt-2'>( ທ່ານໄດ້ทำการໂຫວດແລ້ວ )</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dailyMenu.vote_options && dailyMenu.vote_options.map((pack, index) => {
          if (!pack || !Array.isArray(pack.foodIds) || pack.foodIds.length === 0) {
            console.warn("Skipping malformed vote option or empty food item:", pack);
            return null;
          }

          const foodsInPack = pack.foodIds.map(foodId => foodItems.find(item => item.id === foodId)).filter(Boolean);
          const isSelected = userVotedPackIndex === index;

          return (
            <div 
              key={index} 
              className={`bg-white rounded-xl shadow-soft flex flex-col transition-all duration-300 ease-in-out overflow-hidden transform hover:-translate-y-1
                ${isSelected ? 'ring-2 ring-primary' : 'border border-gray-200'}
              `}
            >
              <div className="flex-grow p-5">
                <div className="flex justify-center space-x-3 mb-4">
                  {foodsInPack.map(food => (
                    <img
                      key={food.id}
                      src={food.image}
                      alt={food.name}
                      className="w-24 h-24 object-cover rounded-lg shadow-sm"
                      onError={(e) => { e.target.onerror = null; e.target.src = `/BG.png`; }}
                    />
                  ))}
                </div>
                <h3 className="text-xl font-semibold text-primary text-center mb-2">{pack.name}</h3>
                <p className="text-center text-secondary mb-4">ຄະແນນໂຫວດ: <span className='font-bold text-accent'>{pack.votes}</span></p>
              </div>
              
              <button
                onClick={() => onVote(index)}
                disabled={hasVoted && !isSelected}
                className={`w-full p-4 font-bold text-white transition-colors duration-300
                  ${isSelected ? 'bg-success' : 'bg-primary hover:bg-opacity-90'}
                  ${hasVoted && !isSelected ? 'bg-gray-300 cursor-not-allowed' : ''}
                `}>
                {isSelected ? '✔️ ເລືອກແລ້ວ' : 'ໂຫວດຊຸດນີ້'}
              </button>
            </div>
          );
        })}
      </div>

      {hasVoted && (
        <div className="text-center mt-8">
          <button
            onClick={onCancelVote}
            className="px-6 py-3 bg-danger text-white font-semibold rounded-lg shadow-md hover:bg-opacity-90 transition-colors"
          >
            ຍົກເລີກການໂຫວດ
          </button>
        </div>
      )}
    </div>
  );
};

export default VotingSection;
