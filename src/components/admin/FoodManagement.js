import React, { useState } from 'react';
import {
  FoodForm,
  FoodList,
  CategoryFilter,
} from '../../components';

const FoodManagement = ({ BACKEND_URL, showMessage, foodItems, setFoodItems }) => {
  const [foodName, setFoodName] = useState('');
  const [foodImage, setFoodImage] = useState('');
  const [foodTags, setFoodTags] = useState('');
  const [editingFoodId, setEditingFoodId] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState('ທັງໝົດ');

  const handleAddOrUpdateFood = async (e) => {
    e.preventDefault();

    if (!foodName.trim() || !foodImage.trim()) {
      showMessage('ກະລຸນາປ້ອນຊື່ ແລະ ຮູບພາບອາຫານ', 'error');
      return;
    }

    const tagsArray = foodTags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

    try {
      let response;
      let method;
      let url;

      if (editingFoodId) {
        method = 'PUT';
        url = `${BACKEND_URL}/api/foods/${editingFoodId}`;
      } else {
        method = 'POST';
        url = `${BACKEND_URL}/api/foods`;
      }

      response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: foodName, image: foodImage, tags: tagsArray }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const foodItem = await response.json();

      if (editingFoodId) {
        setFoodItems(foodItems.map(item => (item.id === foodItem.id ? foodItem : item)));
      } else {
        setFoodItems([...foodItems, foodItem]);
      }

      console.log('Food item added/updated:', foodItem);

      showMessage(editingFoodId ? 'ອັບເດດເມນູອາຫານສຳເລັດແລ້ວ!' : 'ເພີ່ມເມນູອາຫານສຳເລັດແລ້ວ!', 'success');

      setFoodName('');
      setFoodImage('');
      setFoodTags('');
      setEditingFoodId(null);

    } catch (error) {
      console.error("Error adding/updating food item:", error);
      console.log('Error object in catch:', error);
      showMessage('ເກີດຂໍ້ຜິດພາດໃນການເພີ່ມ/ອັບເດດເມນູອາຫານ', 'error');
    }
  };

  const handleEditFood = async (id) => {
    const foodToEdit = foodItems.find(item => item.id === id);
    if (foodToEdit) {
      setFoodName(foodToEdit.name);
      setFoodImage(foodToEdit.image);
      setFoodTags(foodToEdit.tags.join(', '));
      setEditingFoodId(id);
      showMessage('ກຳລັງແກ້ໄຂເມນູອາຫານ...', 'info');
    }
  };

  const handleDeleteFood = async (id) => {
    if (window.confirm('ທ່ານຕ້ອງການລຶບເມນູອາຫານນີ້ບໍ່?')) {
      try {
        const response = await fetch(`${BACKEND_URL}/api/foods/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const updatedFoodItemsResponse = await fetch(`${BACKEND_URL}/api/foods`);
        const updatedFoodItems = await updatedFoodItemsResponse.json();
        setFoodItems(updatedFoodItems);

        showMessage('ລຶບເມນູອາຫານສຳເລັດແລ້ວ!', 'success');
      } catch (error) {
        console.error("Error deleting food item:", error);
        showMessage('ເກີດຂໍ້ຜິດພາດໃນການລຶບເມນູອາຫານ', 'error');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-background rounded-lg shadow-lg">
      <h2 className="text-4xl font-bold text-primary text-center mb-8">ຈັດການເມນູອາຫານ</h2>
      <FoodForm
        foodName={foodName}
        setFoodName={setFoodName}
        foodImage={foodImage}
        setFoodImage={setFoodImage}
        foodTags={foodTags}
        setFoodTags={setFoodTags}
        editingFoodId={editingFoodId}
        handleAddOrUpdateFood={handleAddOrUpdateFood}
        setEditingFoodId={setEditingFoodId}
        showMessage={showMessage}
      />
      <div className="my-8">
        <CategoryFilter
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      </div>
      <FoodList
        filteredFoodItems={foodItems.filter(food => {
          if (selectedCategory === 'ທັງໝົດ') {
            return true;
          }
          return food.tags && food.tags.includes(selectedCategory);
        })}
        handleEditFood={handleEditFood}
        handleDeleteFood={handleDeleteFood}
        BACKEND_URL={BACKEND_URL}
      />
    </div>
  );
};

export default FoodManagement;