import React, { useState } from 'react';
import CategoryFilter from '../myfoods/CategoryFilter'; // Reusing CategoryFilter component

const VoteSelection = ({
  foodItems,
  adminVoteSelections,
  toggleAdminVoteSelection,
  handleStartVoting,
  dailyMenuStatus,
  showMessage,
  selectedAdminCategory,
  setSelectedAdminCategory,
}) => {
  const [searchTerm, setSearchTerm] = useState(''); // New state for search term

  const filteredAdminFoodItems = foodItems.filter(food => {
    const matchesCategory = selectedAdminCategory.trim() === 'ທັງໝົດ' || food.tags.includes(selectedAdminCategory);
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      {/* Selected Items for Voting Display */}
      <div className="mb-6 p-4 border rounded-lg bg-teal-50 shadow-lg">
        <h3 className="mb-2 text-xl font-semibold text-teal-800">ເມນູທີ່ເລືອກສຳລັບໂຫວດ ({adminVoteSelections.length}/5):</h3>
        {adminVoteSelections.length === 0 ? (
          <p className="text-gray-600">ຍັງບໍ່ໄດ້ເລືອກເມນູ</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {adminVoteSelections.map(food => (
              <div key={food.id} className="flex items-center bg-teal-200 text-teal-800 rounded-lg p-2 shadow-sm">
                <img
                  src={food.image}
                  alt={food.name}
                  className="w-8 h-8 object-cover rounded-md mr-2"
                  onError={(e) => { e.target.onerror = null; e.target.src = `/BG.png`; }}
                />
                <span className="text-sm font-medium">{food.name}</span>
                <button
                  onClick={() => toggleAdminVoteSelection(food)}
                  className="ml-2 text-teal-700 hover:text-red-700 font-bold text-lg"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}
        <button
          onClick={handleStartVoting}
          disabled={adminVoteSelections.length !== 5 || dailyMenuStatus === 'voting'}
          className="mt-4 w-full px-6 py-3 font-bold text-white transition duration-300 ease-in-out transform bg-teal-600 shadow-lg rounded-xl hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
        >
          {dailyMenuStatus === 'voting' ? 'ກຳລັງໂຫວດ...' : 'ເລີ່ມການໂຫວດ'}
        </button>
      </div>

      {/* All Food Items for Selection with Category Filter and Search */}
      <div className="mb-6">
        <h3 className="mb-4 text-xl font-semibold text-gray-700">ເລືອກເມນູຈາກລາຍການທັງໝົດ:</h3>
        <div className="flex flex-wrap items-center gap-4 mb-4">
          {/* Admin Category Filter - Reusing CategoryFilter component */}
          <CategoryFilter
            selectedCategory={selectedAdminCategory}
            setSelectedCategory={setSelectedAdminCategory}
            label="ກັ່ນຕອງຕາມໝວດໝູ່:"
            idPrefix="admin"
          />
          {/* Search Input */}
          <input
            type="text"
            placeholder="ຄົ້ນຫາຊື່ເມນູ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow px-4 py-3 text-lg border border-gray-300 shadow-sm rounded-xl focus:ring-teal-500 focus:border-teal-500"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 max-h-96 overflow-y-auto p-2 border rounded-lg bg-gray-50">
          {filteredAdminFoodItems.map((food) => {
            const isSelected = adminVoteSelections.some(item => item.id === food.id);
            const isDisabled = adminVoteSelections.length >= 5 && !isSelected;
            return (
              <div
                key={food.id}
                className={`p-3 border rounded-lg flex items-center justify-between shadow-md ${
                  isSelected ? 'bg-teal-100 border-teal-400' : 'bg-white border-gray-200'
                } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center">
                  <img
                    src={food.image}
                    alt={food.name}
                    className="w-12 h-12 object-cover rounded-md mr-3"
                    onError={(e) => { e.target.onerror = null; e.target.src = `/BG.png`; }}
                  />
                  <span className="font-medium text-gray-800">{food.name}</span>
                </div>
                <button
                  onClick={() => toggleAdminVoteSelection(food)}
                  disabled={isDisabled}
                  className={`px-4 py-2 rounded-lg text-white font-semibold transition ${
                    isSelected ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isSelected ? 'ລຶບອອກ' : 'ເພີ່ມເຂົ້າໂຫວດ'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default VoteSelection;