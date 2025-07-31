import React, { useState } from 'react';
import {
  FoodList,
  CategoryFilter,
} from '../components';

const MyFoodsPage = ({ BACKEND_URL, foodItems }) => {
  const [selectedCategory, setSelectedCategory] = useState('ທັງໝົດ');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFoods = foodItems.filter(food => {
    const matchesCategory = selectedCategory === 'ທັງໝົດ' || (food.tags && food.tags.includes(selectedCategory));
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-8 bg-background">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-primary mb-2">ລາຍການເມນູທັງໝົດ</h1>
        <p className="text-lg text-secondary">ຄົ້ນຫາ ແລະ ສຳຫຼວດເມນູທີ່ທ່ານມັກ</p>
      </div>

      <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-8">
        <CategoryFilter
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          label="" // Label is now part of the placeholder-like design
        />
        <div className="relative w-full md:w-auto">
          <input
            type="text"
            placeholder="ຄົ້ນຫາຊື່ເມນູ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-80 px-4 py-3 text-base border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
          />
        </div>
      </div>

      <FoodList
        filteredFoodItems={filteredFoods}
        handleEditFood={() => {}}
        handleDeleteFood={() => {}}
        BACKEND_URL={BACKEND_URL}
      />
    </div>
  );
};

export default MyFoodsPage;