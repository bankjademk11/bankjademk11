import React, { useState } from 'react';
import {
  FoodList,
  CategoryFilter,
} from '../components';

const MyFoodsPage = ({ BACKEND_URL, foodItems }) => {
  // State for filtering food items in 'my_foods' page
  const [selectedCategory, setSelectedCategory] = useState('ທັງໝົດ');
  const [searchTerm, setSearchTerm] = useState(''); // New state for search term

  const filteredFoods = foodItems.filter(food => {
    const matchesCategory = selectedCategory === 'ທັງໝົດ' || food.tags.includes(selectedCategory);
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <CategoryFilter
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        label="ກັ່ນຕອງຕາມໝວດໝູ່:"
      />

      {/* Search Input */}
      <div className="mb-6 text-center">
        <input
          type="text"
          placeholder="ຄົ້ນຫາຊື່ເມນູ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full max-w-xs mx-auto px-4 py-3 mt-1 text-lg border border-gray-300 shadow-sm rounded-xl focus:ring-teal-500 focus:border-teal-500"
        />
      </div>

      <FoodList
        filteredFoodItems={filteredFoods}
        // CRUD operations are now handled in Admin's FoodManagement
        handleEditFood={() => { /* No-op or show message */ }}
        handleDeleteFood={() => { /* No-op or show message */ }}
        BACKEND_URL={BACKEND_URL}
      />
    </>
  );
};

export default MyFoodsPage;