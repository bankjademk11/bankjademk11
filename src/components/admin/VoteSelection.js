import React, { useState } from 'react';
import CategoryFilter from '../myfoods/CategoryFilter';

const VoteSelection = ({
  foodItems,
  handleStartVoting,
  isStartingVote, // Receive the new prop
  showMessage,
  selectedAdminCategory,
  setSelectedAdminCategory,
  selectedDate,
  editingVoteOptions,
  editingDate,
  adminFinalVotePacks,
  setAdminFinalVotePacks,
  adminSelectedFoodForPack,
  setAdminSelectedFoodForPack,
}) => {
  const today = new Date().toISOString().split('T')[0];
  const isPastDate = selectedDate < today;

  const [searchTerm, setSearchTerm] = useState('');

  const filteredAdminFoodItems = foodItems.filter(food => {
    const matchesCategory = selectedAdminCategory.trim() === 'ທັງໝົດ' || (food.tags && food.tags.includes(selectedAdminCategory));
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleFoodSelectForPack = (foodId) => {
    if (adminSelectedFoodForPack.includes(foodId)) {
      setAdminSelectedFoodForPack(adminSelectedFoodForPack.filter(id => id !== foodId));
    } else if (adminSelectedFoodForPack.length < 2) {
      setAdminSelectedFoodForPack([...adminSelectedFoodForPack, foodId]);
    } else {
      setAdminSelectedFoodForPack([adminSelectedFoodForPack[1], foodId]);
    }
  };

  const handleAddPack = () => {
    if (adminSelectedFoodForPack.length > 0) {
      const newPack = [...adminSelectedFoodForPack].sort((a, b) => a - b);
      const isDuplicate = adminFinalVotePacks.some(pack => {
        if (pack.length !== newPack.length) return false;
        return pack.every((value, index) => value === newPack[index]);
      });

      if (isDuplicate) {
        showMessage('ຊຸດອາຫານນີ້ຖືກເພີ່ມແລ້ວ!', 'error');
        return;
      }

      setAdminFinalVotePacks([...adminFinalVotePacks, newPack]);
      setAdminSelectedFoodForPack([]);
    } else {
      showMessage('ກະລຸນາເລືອກອາຫານຢ່າງໜ້ອຍ 1 ຊະນິດເພື່ອສ້າງຊຸດ.', 'error');
    }
  };

  const handleRemovePack = (indexToRemove) => {
    setAdminFinalVotePacks(adminFinalVotePacks.filter((_, index) => index !== indexToRemove));
  };

  const handleStartVotingWithPacks = () => {
    if (adminFinalVotePacks.length === 0) {
      showMessage('ກະລຸນາເພີ່ມຢ່າງໜ້ອຍໜຶ່ງຊຸດອາຫານເພື່ອເລີ່ມການໂຫວດ.', 'error');
      return;
    }
    handleStartVoting(adminFinalVotePacks);
  };

  return (
    <div className="p-6 bg-surface rounded-2xl border border-gray-200">
      <h3 className="mb-6 text-3xl font-bold text-center text-primary">ຈັດການການໂຫວດ</h3>

      {/* Select Food Packs for Voting */}
      <div className="mb-8 p-6 bg-background rounded-lg border border-gray-200">
        <h4 className="mb-4 text-xl font-semibold text-primary">ເລືອກອາຫານສຳລັບຊຸດໂຫວດ:</h4>
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <CategoryFilter
            selectedCategory={selectedAdminCategory}
            setSelectedCategory={setSelectedAdminCategory}
          />
          <input
            type="text"
            placeholder="ຄົ້ນຫາຊື່ເມນູ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-primary focus:border-transparent transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto p-2 border border-gray-200 rounded-lg bg-white">
          {filteredAdminFoodItems.map(food => (
            <div
              key={food.id}
              className={`p-3 border rounded-lg flex flex-col items-center cursor-pointer transition-all duration-200
                ${adminSelectedFoodForPack.includes(food.id) ? 'bg-primary text-white border-primary' : 'bg-white border-gray-200 hover:bg-gray-50'}
              `}
              onClick={() => handleFoodSelectForPack(food.id)}
            >
              <img
                src={food.image}
                alt={food.name}
                className="w-24 h-24 object-cover rounded-md mb-2"
                onError={(e) => { e.target.onerror = null; e.target.src = `/BG.png`; }}
              />
              <span className={`font-medium text-center ${adminSelectedFoodForPack.includes(food.id) ? 'text-white' : 'text-primary'}`}>{food.name}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={handleAddPack}
            disabled={adminSelectedFoodForPack.length === 0}
            className="px-6 py-3 font-bold text-white transition duration-300 ease-in-out transform bg-primary rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ເພີ່ມຊຸດອາຫານ ({adminSelectedFoodForPack.length})
          </button>
          <button
            onClick={() => setAdminSelectedFoodForPack([])}
            disabled={adminSelectedFoodForPack.length === 0}
            className="px-6 py-3 font-bold text-white transition duration-300 ease-in-out transform bg-gray-400 rounded-lg hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ລ້າງການເລືອກ
          </button>
        </div>
      </div>

      {adminFinalVotePacks.length > 0 && (
        <div className="p-6 bg-background rounded-lg border border-gray-200">
          <h4 className="mb-4 text-xl font-semibold text-primary">ຊຸດອາຫານສຳລັບການໂຫວດ:</h4>
          <div className="space-y-3">
            {adminFinalVotePacks.map((pack, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                <span className="font-medium text-primary">
                  {foodItems.find(f => f.id === pack[0])?.name} {pack.length > 1 ? `& ${foodItems.find(f => f.id === pack[1])?.name}` : ''}
                </span>
                <button
                  onClick={() => handleRemovePack(index)}
                  className="ml-4 px-4 py-2 text-sm font-bold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                >
                  ລົບ
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={handleStartVotingWithPacks}
            disabled={isStartingVote || isPastDate}
            className="mt-6 w-full px-6 py-3 font-bold text-white transition duration-300 ease-in-out transform bg-primary rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isStartingVote ? 'ກຳລັງໂຫວດ...' : (editingDate ? 'ອັບເດດການໂຫວດ' : 'ເລີ່ມການໂຫວດຊຸດອາຫານ')}
          </button>
        </div>
      )}
    </div>
  );
};

export default VoteSelection;