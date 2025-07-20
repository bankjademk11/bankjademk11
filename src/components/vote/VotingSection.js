import React from 'react';

const VotingSection = ({ dailyMenu, userId, handleVote }) => {
  return (
    <div>
      <p className="text-center text-xl mb-4 text-gray-700 font-semibold">
        กำลังเปิดโหวตเมนูประจำวัน!
        {dailyMenu.votedUsers && dailyMenu.votedUsers[userId] ? ' (คุณโหวตแล้ว)' : ''}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dailyMenu.voteOptions.map((option) => (
          <div key={option.foodItemId} className="bg-gray-50 p-4 rounded-xl shadow-md flex flex-col items-center">
            <img
              src={option.image}
              alt={option.name}
              className="w-full h-32 object-cover rounded-lg mb-3"
              onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x300/CCCCCC/000000?text=Image+Not+Found`; }}
            />
            <h3 className="text-xl font-semibold mb-2">{option.name}</h3>
            <p className="text-lg text-teal-600 mb-4">คะแนนโหวต: {option.votes}</p>
            <button
              onClick={() => handleVote(option.foodItemId)}
              disabled={dailyMenu.votedUsers && dailyMenu.votedUsers[userId]}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              โหวต
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VotingSection;