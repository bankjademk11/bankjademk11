import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  Header,
  Navigation,
  MessageDisplay,
} from './components';
import MyFoodsPage from './pages/MyFoodsPage';
import VotePage from './pages/VotePage';
import AdminPage from './pages/AdminPage';
import DailyReportDetail from './components/admin/DailyReportDetail';

const App = () => {
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const [message, setMessage] = useState({ text: '', type: '' });

  const showMessage = useCallback((text, type) => {
    setMessage({ text, type });
    setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 3000);
  }, [setMessage]);

  const [userId] = useState(() => {
    let id = localStorage.getItem('offlineUserId');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('offlineUserId', id);
    }
    return id;
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const ADMIN_PASSWORD = 'admin';

  const [foodItems, setFoodItems] = useState([]);
  const [foodName, setFoodName] = useState('');
  const [foodImage, setFoodImage] = useState('');
  const [foodTags, setFoodTags] = useState('');
  const [editingFoodId, setEditingFoodId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');

  const [adminVoteSelections, setAdminVoteSelections] = useState([]);
  const [adminDirectSelectFoodId, setAdminDirectSelectFoodId] = useState('');
  const [selectedAdminCategory, setSelectedAdminCategory] = useState('ทั้งหมด');

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/foods`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setFoodItems(data);
      } catch (error) {
        console.error("Error fetching food items:", error);
        showMessage('ไม่สามารถโหลดรายการอาหารได้', 'error');
      }
    };

    fetchFoodItems();
  }, [BACKEND_URL, showMessage]);

  const [dailyMenu, setDailyMenu] = useState({ status: 'loading' });

  useEffect(() => {
    const fetchDailyMenu = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/daily-menu`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDailyMenu(data);
      } catch (error) {
        console.error("Error fetching daily menu:", error);
        showMessage('ไม่สามารถโหลดข้อมูลโหวตได้', 'error');
      }
    };

    fetchDailyMenu(); // Initial fetch
    const intervalId = setInterval(fetchDailyMenu, 3000); // Poll every 3 seconds

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [BACKEND_URL, showMessage]);

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

      const updatedFoodItemsResponse = await fetch(`${BACKEND_URL}/api/foods`);
      const updatedFoodItems = await updatedFoodItemsResponse.json();
      setFoodItems(updatedFoodItems);

      showMessage(editingFoodId ? 'อัปเดตเมนูอาหารเรียบร้อยแล้ว!' : 'เพิ่มเมนูอาหารเรียบร้อยแล้ว!', 'success');

      setFoodName('');
      setFoodImage('');
      setFoodTags('');
      setEditingFoodId(null);

    } catch (error) {
      console.error("Error adding/updating food item:", error);
      showMessage('เกิดข้อผิดพลาดในการเพิ่ม/อัปเดตเมนูอาหาร', 'error');
    }
  };

  

  const handleAdminLogin = () => {
    if (adminPasswordInput === ADMIN_PASSWORD) {
      setIsAdmin(true);
      showMessage('เข้าสู่ระบบแอดมินสำเร็จ!', 'success');
    } else {
      showMessage('รหัสผ่านแอดมินไม่ถูกต้อง', 'error');
    }
    setAdminPasswordInput('');
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    showMessage('ออกจากระบบแอดมินแล้ว', 'info');
  };

  const toggleAdminVoteSelection = (food) => {
    const isSelected = adminVoteSelections.some(item => item.id === food.id);
    if (isSelected) {
      setAdminVoteSelections(adminVoteSelections.filter(item => item.id !== food.id));
    } else {
      if (adminVoteSelections.length < 5) {
        setAdminVoteSelections([...adminVoteSelections, food]);
      } else {
        showMessage('เลือกได้สูงสุด 5 เมนูสำหรับโหวตเท่านั้น', 'info');
      }
    }
  };

  const handleStartVoting = async () => {
    if (adminVoteSelections.length !== 5) {
      showMessage('ต้องเลือก 5 เมนูที่ไม่ซ้ำกันสำหรับโหวต', 'error');
      return;
    }
    const voteOptions = adminVoteSelections.map(item => ({
      foodItemId: item.id,
      name: item.name,
      image: item.image,
    }));

    try {
      const response = await fetch(`${BACKEND_URL}/api/daily-menu/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voteOptions }),
      });
      if (!response.ok) throw new Error('Failed to start voting');
      const data = await response.json();
      setDailyMenu(data);
      showMessage('เริ่มการโหวตเมนูประจำวันแล้ว!', 'success');
      setAdminVoteSelections([]);
    } catch (error) {
      console.error("Error starting voting:", error);
      showMessage('เกิดข้อผิดพลาดในการเริ่มโหวต', 'error');
    }
  };

  const handleCloseVoting = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/daily-menu/close`, { method: 'POST' });
      if (!response.ok) throw new Error('Failed to close voting');
      const data = await response.json();
      setDailyMenu(data);
      const winningFood = foodItems.find(f => f.id === data.winningFoodItemId);
      showMessage(`ปิดการโหวตแล้ว! เมนูที่ชนะคือ ${winningFood ? winningFood.name : 'ไม่มี'}`, 'success');
    } catch (error) {
      console.error("Error closing voting:", error);
      showMessage('เกิดข้อผิดพลาดในการปิดโหวต', 'error');
    }
  };

  const handleAdminSetFood = async () => {
    if (!adminDirectSelectFoodId) {
      showMessage('ต้องเลือกเมนู', 'error');
      return;
    }
    try {
      const response = await fetch(`${BACKEND_URL}/api/daily-menu/admin-set`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ foodId: adminDirectSelectFoodId }),
      });
      if (!response.ok) throw new Error('Failed to set food by admin');
      const data = await response.json();
      setDailyMenu(data);
      showMessage('ตั้งค่าเมนูประจำวันโดยแอดมินเรียบร้อยแล้ว!', 'success');
      setAdminDirectSelectFoodId('');
    } catch (error) {
      console.error("Error setting food by admin:", error);
      showMessage('เกิดข้อผิดพลาดในการตั้งค่าเมนู', 'error');
    }
  };

  const handleVote = async (foodItemId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/daily-menu/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, foodItemId }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to vote');
      }
      const data = await response.json();
      setDailyMenu(data);
      showMessage('โหวตสำเร็จ!', 'success');
    } catch (error) {
      console.error("Error voting:", error);
      showMessage(error.message === 'User has already voted.' ? 'คุณโหวตไปแล้วสำหรับวันนี้!' : 'เกิดข้อผิดพลาดในการโหวต', 'error');
    }
  };

  const handleReviewSubmit = useCallback(async (foodId, rating, comment) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/foods/${foodId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating, comment, userId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newReview = await response.json();
      console.log('Review submitted:', newReview);
      showMessage('ส่งรีวิวเรียบร้อยแล้ว!', 'success');
    } catch (error) {
      console.error("Error submitting review:", error);
      showMessage('เกิดข้อผิดพลาดในการส่งรีวิว', 'error');
    }
  }, [BACKEND_URL, userId, showMessage]);

  const getWinningFoodDetails = () => {
    if (!dailyMenu) return null;

    if (dailyMenu.status === 'closed' && dailyMenu.winningFoodItemId) {
      return foodItems.find(item => item.id === dailyMenu.winningFoodItemId) ||
             dailyMenu.voteOptions.find(option => option.foodItemId === dailyMenu.winningFoodItemId);
    } else if (dailyMenu.status === 'admin_set' && dailyMenu.adminSetFoodItemId) {
      return foodItems.find(item => item.id === dailyMenu.adminSetFoodItemId);
    }
    return null;
  };

  const winningFood = getWinningFoodDetails();

  return (
    <BrowserRouter>
      <div className="min-h-screen p-4 text-gray-800 bg-food-bg bg-cover bg-center bg-fixed font-inter">
        <Header userId={userId} />
        <MessageDisplay message={message} />
        <Navigation />

        <Routes>
          <Route path="/" element={
            <MyFoodsPage
              BACKEND_URL={BACKEND_URL}
              showMessage={showMessage}
              foodItems={foodItems}
              setFoodItems={setFoodItems}
              foodName={foodName}
              setFoodName={setFoodName}
              foodImage={foodImage}
              setFoodImage={setFoodImage}
              foodTags={foodTags}
              setFoodTags={setFoodTags}
              editingFoodId={editingFoodId}
              handleAddOrUpdateFood={handleAddOrUpdateFood}
              setEditingFoodId={setEditingFoodId}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          } />
          <Route path="/vote" element={
            <VotePage
              dailyMenu={dailyMenu}
              userId={userId}
              handleVote={handleVote}
              handleReviewSubmit={handleReviewSubmit}
              foodItems={foodItems}
              winningFood={winningFood}
            />
          } />
          <Route path="/admin" element={
            <AdminPage
              isAdmin={isAdmin}
              adminPasswordInput={adminPasswordInput}
              setAdminPasswordInput={setAdminPasswordInput}
              handleAdminLogin={handleAdminLogin}
              handleAdminLogout={handleAdminLogout}
              foodItems={foodItems}
              adminVoteSelections={adminVoteSelections}
              setAdminVoteSelections={setAdminVoteSelections}
              toggleAdminVoteSelection={toggleAdminVoteSelection}
              handleStartVoting={handleStartVoting}
              dailyMenu={dailyMenu}
              handleCloseVoting={handleCloseVoting}
              adminDirectSelectFoodId={adminDirectSelectFoodId}
              setAdminDirectSelectFoodId={setAdminDirectSelectFoodId}
              handleAdminSetFood={handleAdminSetFood}
              showMessage={showMessage}
              selectedAdminCategory={selectedAdminCategory}
              setSelectedAdminCategory={setSelectedAdminCategory}
              BACKEND_URL={BACKEND_URL}
            />
          } />
          <Route path="/report/:id" element={<DailyReportDetail BACKEND_URL={BACKEND_URL} showMessage={showMessage} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;