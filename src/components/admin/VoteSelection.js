import React, { useState, useEffect } from 'react';
import CategoryFilter from '../myfoods/CategoryFilter'; // Reusing CategoryFilter component

const VoteSelection = ({
  foodItems,
  handleStartVoting, // This prop will now receive the array of food packs
  dailyMenuStatus,
  showMessage,
  selectedAdminCategory,
  setSelectedAdminCategory,
  selectedDate, // Receive selectedDate prop
  editingVoteOptions, // New prop for editing
  editingDate, // New prop for editing date
  adminFinalVotePacks, // Lifted state
  setAdminFinalVotePacks, // Lifted setter
  adminSelectedFoodForPack, // Lifted state
  setAdminSelectedFoodForPack, // Lifted setter
}) => {
  const [searchTerm, setSearchTerm] = useState(''); // New state for search term

  useEffect(() => {
    if (editingVoteOptions && editingDate === selectedDate) {
      // Convert vote_options from objects to arrays of foodIds
      const packsToLoad = editingVoteOptions.map(pack => pack.foodIds);
      setAdminFinalVotePacks(packsToLoad);
    } else {
      setAdminFinalVotePacks([]); // Clear if not editing or date doesn't match
    }
  }, [editingVoteOptions, editingDate, selectedDate, setAdminFinalVotePacks]);

  const filteredAdminFoodItems = foodItems.filter(food => {
    const matchesCategory = selectedAdminCategory.trim() === 'ທັງໝົດ' || food.tags.includes(selectedAdminCategory);
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleFoodSelectForPack = (foodId) => {
    if (adminSelectedFoodForPack.includes(foodId)) {
      // Deselect if already selected
      setAdminSelectedFoodForPack(adminSelectedFoodForPack.filter(id => id !== foodId));
    } else if (adminSelectedFoodForPack.length < 2) {
      // Select if less than 2 items are selected
      setAdminSelectedFoodForPack([...adminSelectedFoodForPack, foodId]);
    } else {
      // If 2 items are already selected, replace the first one with the new selection
      setAdminSelectedFoodForPack([adminSelectedFoodForPack[1], foodId]);
    }
  };

  const handleAddPack = () => {
    if (adminSelectedFoodForPack.length === 2) {
      // Ensure the pack is not already added
      const newPack = [...adminSelectedFoodForPack].sort((a, b) => a - b); // Sort to ensure consistent order
      const isDuplicate = adminFinalVotePacks.some(pack =>
        pack[0] === newPack[0] && pack[1] === newPack[1]
      );

      if (isDuplicate) {
        showMessage('ຊຸດອາຫານນີ້ຖືກເພີ່ມແລ້ວ!', 'error');
        return;
      }

      setAdminFinalVotePacks([...adminFinalVotePacks, newPack]);
      setAdminSelectedFoodForPack([]); // Clear current selection after adding
    } else {
      showMessage('ກະລຸນາເລືອກອາຫານ 2 ຊະນິດເພື່ອສ້າງຊຸດ.', 'error');
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
    handleStartVoting(adminFinalVotePacks, selectedDate);
  };

  return (
    <>
      {/* Select Food Packs for Voting */}
      <div className="mb-6 p-4 border rounded-lg bg-teal-50 shadow-lg">
        <h3 className="mb-2 text-xl font-semibold text-teal-800">ເລືອກຊຸດອາຫານສຳລັບການໂຫວດ:</h3>
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <CategoryFilter
            selectedCategory={selectedAdminCategory}
            setSelectedCategory={setSelectedAdminCategory}
            label="ກັ່ນຕອງຕາມໝວດໝູ່:"
            idPrefix="admin"
          />
          <input
            type="text"
            placeholder="ຄົ້ນຫາຊື່ເມນູ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow px-4 py-3 text-lg border border-gray-300 shadow-sm rounded-xl focus:ring-teal-500 focus:border-teal-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto p-2 border rounded-lg bg-gray-50">
          {filteredAdminFoodItems.map(food => (
            <div
              key={food.id}
              className={`p-3 border rounded-lg flex flex-col items-center shadow-md cursor-pointer ${
                adminSelectedFoodForPack.includes(food.id) ? 'bg-blue-100 border-blue-400' : 'bg-white border-gray-200'
              }`}
              onClick={() => handleFoodSelectForPack(food.id)}
            >
              <img
                src={food.image}
                alt={food.name}
                className="w-24 h-24 object-cover rounded-md mb-2"
                onError={(e) => { e.target.onerror = null; e.target.src = `/BG.png`; }}
              />
              <span className="font-medium text-gray-800 text-center">{food.name}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-center space-x-4">
          <button
            onClick={handleAddPack}
            disabled={adminSelectedFoodForPack.length !== 2}
            className="px-6 py-3 font-bold text-white transition duration-300 ease-in-out transform bg-green-500 shadow-lg rounded-xl hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
          >
            ເພີ່ມຊຸດອາຫານ ({adminSelectedFoodForPack.length}/2)
          </button>
          <button
            onClick={() => setAdminSelectedFoodForPack([])}
            disabled={adminSelectedFoodForPack.length === 0}
            className="px-6 py-3 font-bold text-white transition duration-300 ease-in-out transform bg-gray-500 shadow-lg rounded-xl hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
          >
            ລ້າງການເລືອກ
          </button>
        </div>

        {adminFinalVotePacks.length > 0 && (
          <div className="mt-6">
            <h4 className="mb-3 text-lg font-semibold text-gray-700">ຊຸດອາຫານສຳລັບການໂຫວດ:</h4>
            <div className="space-y-2">
              {adminFinalVotePacks.map((pack, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white border rounded-lg shadow-sm">
                  <span className="font-medium text-gray-800">
                    {foodItems.find(f => f.id === pack[0])?.name} & {foodItems.find(f => f.id === pack[1])?.name}
                  </span>
                  <button
                    onClick={() => handleRemovePack(index)}
                    className="ml-4 px-3 py-1 text-sm font-bold text-white bg-red-500 rounded-lg hover:bg-red-600"
                  >
                    ລົບ
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={handleStartVotingWithPacks}
              disabled={dailyMenuStatus === 'voting'}
              className="mt-4 w-full px-6 py-3 font-bold text-white transition duration-300 ease-in-out transform bg-blue-600 shadow-lg rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
            >
              {dailyMenuStatus === 'voting' ? 'ກຳລັງໂຫວດ...' : 'ເລີ່ມການໂຫວດຊຸດອາຫານ'}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default VoteSelection;