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
    <div className="animate-slide-up">
      <div className="text-center mb-8">
        {hasVoted && 
          <p className='text-lg font-medium text-success animate-fade-in'>
            ✓ ທ່ານໄດ້ທຳການໂຫວດແລ້ວ
          </p>
        }
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {dailyMenu.vote_options && dailyMenu.vote_options.map((pack, index) => {
          if (!pack || !Array.isArray(pack.foodIds) || pack.foodIds.length === 0) {
            return null;
          }

          const foodsInPack = pack.foodIds.map(foodId => foodItems.find(item => item.id === foodId)).filter(Boolean);
          const isSelected = userVotedPackIndex === index;

          return (
            <div 
              key={index} 
              className={`bg-surface rounded-2xl shadow-md flex flex-col transition-all duration-300 ease-in-out group transform hover:-translate-y-2
                ${isSelected ? 'ring-4 ring-primary-light shadow-xl' : 'border border-neutral-200'}
              `}
            >
              <div className="relative pt-[60%] overflow-hidden rounded-t-2xl bg-neutral-200">
                {/* Flex container for images */}
                <div className="absolute inset-0 flex">
                  {foodsInPack.slice(0, 2).map((food, imgIndex) => (
                      <div key={food.id} className="w-full h-full relative">
                          <img
                              src={food.image || '/BG.png'}
                              alt={food.name}
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              onError={(e) => { e.target.onerror = null; e.target.src = '/BG.png'; }}
                          />
                      </div>
                  ))}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4">
                    <h3 className="text-xl font-bold text-white" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}>{pack.name}</h3>
                </div>
              </div>

              <div className="flex-grow p-4 flex flex-col">
                <div className="flex-grow mb-4">
                    <p className="text-neutral-500 text-sm mb-3">ປະກອບດ້ວຍ:</p>
                    <ul className="space-y-2">
                        {foodsInPack.map(food => (
                            <li key={food.id} className="flex items-center text-neutral-700 text-sm">
                                <span className="text-primary-dark mr-2">•</span>
                                {food.name}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="text-center py-2 px-4 bg-neutral-100 rounded-lg mb-4">
                    <p className="font-bold text-lg text-primary-dark">{pack.votes} <span className="text-sm font-normal text-neutral-500">ຄະແນນ</span></p>
                </div>
                <button
                  onClick={() => onVote(index)}
                  disabled={hasVoted}
                  className={`w-full p-3 font-bold text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg disabled:shadow-none
                    ${isSelected ? 'bg-success hover:bg-success/90' : 'bg-primary hover:bg-primary-dark'}
                    ${hasVoted && !isSelected ? 'bg-neutral-300 cursor-not-allowed' : ''}
                  `}>
                  {isSelected ? '✓ ເລືອກຊຸດນີ້ແລ້ວ' : 'ໂຫວດຊຸດນີ້'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {hasVoted && (
        <div className="text-center mt-12">
          <button
            onClick={onCancelVote}
            className="px-8 py-3 bg-danger text-white font-semibold rounded-xl shadow-lg hover:bg-danger/90 transform hover:-translate-y-0.5 transition-all duration-300"
          >
            ຍົກເລີກການໂຫວດ
          </button>
        </div>
      )}
    </div>
  );
};

export default VotingSection;
