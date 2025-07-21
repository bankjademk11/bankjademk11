import React, { useState, useEffect } from 'react';
import {
  FoodForm,
  FoodList,
  CategoryFilter,
} from '../components';

const MyFoodsPage = ({ BACKEND_URL, showMessage, foodItems, setFoodItems }) => {
  // State for the form inputs (for adding/editing food items)
  const [foodName, setFoodName] = useState('');
  const [foodImage, setFoodImage] = useState('');
  const [foodTags, setFoodTags] = useState('');
  const [editingFoodId, setEditingFoodId] = useState(null);

  // State for filtering food items in 'my_foods' page
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');

  // --- CRUD Operations for Food Items (using backend API) ---
  const handleAddOrUpdateFood = async (e) => {
    e.preventDefault();

    if (!foodName.trim() || !foodImage.trim()) {
      showMessage('กรุณากรอกชื่อและรูปภาพอาหาร', 'error');
      return;
    }

    const tagsArray = foodTags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

    try {
      let response;
      let method;
      let url;

      if (editingFoodId) {
        // Update existing food item
        method = 'PUT';
        url = `${BACKEND_URL}/api/foods/${editingFoodId}`;
      } else {
        // Add new food item
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

      // Re-fetch all food items to update the list
      const updatedFoodItemsResponse = await fetch(`${BACKEND_URL}/api/foods`);
      const updatedFoodItems = await updatedFoodItemsResponse.json();
      setFoodItems(updatedFoodItems);

      showMessage(editingFoodId ? 'อัปเดตเมนูอาหารเรียบร้อยแล้ว!' : 'เพิ่มเมนูอาหารเรียบร้อยแล้ว!', 'success');

      // Clear form fields
      setFoodName('');
      setFoodImage('');
      setFoodTags('');
      setEditingFoodId(null);

    } catch (error) {
      console.error("Error adding/updating food item:", error);
      showMessage('เกิดข้อผิดพลาดในการเพิ่ม/อัปเดตเมนูอาหาร', 'error');
    }
  };

  const handleEditFood = async (id) => {
    const foodToEdit = foodItems.find(item => item.id === id);
    if (foodToEdit) {
      setFoodName(foodToEdit.name);
      setFoodImage(foodToEdit.image);
      setFoodTags(foodToEdit.tags.join(', '));
      setEditingFoodId(id);
      showMessage('กำลังแก้ไขเมนูอาหาร...', 'info');
    }
  };

  const handleDeleteFood = async (id) => {
    if (window.confirm('คุณต้องการลบเมนูอาหารนี้หรือไม่?')) {
      try {
        const response = await fetch(`${BACKEND_URL}/api/foods/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Re-fetch all food items to update the list
        const updatedFoodItemsResponse = await fetch(`${BACKEND_URL}/api/foods`);
        const updatedFoodItems = await updatedFoodItemsResponse.json();
        setFoodItems(updatedFoodItems);

        showMessage('ลบเมนูอาหารเรียบร้อยแล้ว!', 'success');
      } catch (error) {
        console.error("Error deleting food item:", error);
        showMessage('เกิดข้อผิดพลาดในการลบเมนูอาหาร', 'error');
      }
    }
  };

  return (
    <>
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
      <CategoryFilter
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        label="กรองตามหมวดหมู่:"
      />
      <FoodList
        filteredFoodItems={foodItems.filter(food => {
          if (selectedCategory === 'ทั้งหมด') {
            return true;
          }
          return food.tags.includes(selectedCategory);
        })}
        handleEditFood={handleEditFood}
        handleDeleteFood={handleDeleteFood}
        BACKEND_URL={BACKEND_URL}
      />
    </>
  );
};

export default MyFoodsPage;