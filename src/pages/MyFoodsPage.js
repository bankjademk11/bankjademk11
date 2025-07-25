import React, { useState } from 'react';
import {
  FoodList,
  CategoryFilter,
} from '../components';

const MyFoodsPage = ({ BACKEND_URL, foodItems }) => {
  // State for filtering food items in 'my_foods' page
  const [selectedCategory, setSelectedCategory] = useState('ທັງໝົດ');

  return (
    <>
      <CategoryFilter
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        label="ກັ່ນຕອງຕາມໝວດໝູ່:"
      />
      <FoodList
        filteredFoodItems={foodItems.filter(food => {
          if (selectedCategory === 'ທັງໝົດ') {
            return true;
          }
          return food.tags.includes(selectedCategory);
        })}
        // CRUD operations are now handled in Admin's FoodManagement
        handleEditFood={() => { /* No-op or show message */ }}
        handleDeleteFood={() => { /* No-op or show message */ }}
        BACKEND_URL={BACKEND_URL}
      />
    </>
  );
};

export default MyFoodsPage;