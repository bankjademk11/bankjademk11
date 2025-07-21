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

  const [userId, setUserId] = useState(() => {
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

  const [dailyMenu, setDailyMenu] = useState(() => {
    const savedDailyMenu = localStorage.getItem('thaiFoodMenu_dailyMenu');
    return savedDailyMenu ? JSON.parse(savedDailyMenu) : {
      status: 'idle',
      voteOptions: [],
      votedUsers: {},
      winningFoodItemId: null,
      adminSetFoodItemId: null,
      timestamp: null,
    };
  });

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

  const handleStartVoting = () => {
    if (adminVoteSelections.length !== 5) {
      showMessage('ต้องเลือก 5 เมนูที่ไม่ซ้ำกันสำหรับโหวต', 'error');
      return;
    }

    const voteOptions = adminVoteSelections.map(item => ({
      foodItemId: item.id,
      name: item.name,
      image: item.image,
      votes: 0,
    }));

    setDailyMenu({
      status: 'voting',
      voteOptions: voteOptions,
      votedUsers: {},
      winningFoodItemId: null,
      adminSetFoodItemId: null,
      timestamp: new Date().toISOString(),
    });
    showMessage('เริ่มการโหวตเมนูประจำวันแล้ว!', 'success');
    setAdminVoteSelections([]);
  };

  const handleCloseVoting = async () => {
    if (dailyMenu.status !== 'voting') {
      showMessage('ไม่ได้อยู่ในสถานะกำลังโหวต', 'error');
      return;
    }

    let winningItem = null;
    if (dailyMenu.voteOptions && dailyMenu.voteOptions.length > 0) {
      winningItem = dailyMenu.voteOptions.reduce((prev, current) =>
        (prev.votes > current.votes) ? prev : current
      );
    }

    setDailyMenu(prev => ({
      ...prev,
      status: 'closed',
      winningFoodItemId: winningItem ? winningItem.foodItemId : null,
      timestamp: new Date().toISOString(),
    }));
    showMessage(`ปิดการโหวตแล้ว! เมนูที่ชนะคือ ${winningItem ? winningItem.name : 'ไม่มี'}`, 'success');

    try {
      const today = new Date().toISOString().split('T')[0];
      const totalVotes = dailyMenu.voteOptions.reduce((sum, option) => sum + option.votes, 0);
      const voteDetails = dailyMenu.voteOptions.reduce((acc, option) => {
        acc[option.foodItemId] = option.votes;
        return acc;
      }, {});

      const response = await fetch(`${BACKEND_URL}/api/daily-results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: today,
          winningFoodId: winningItem ? winningItem.foodItemId : null,
          winningFoodName: winningItem ? winningItem.name : null,
          totalVotes: totalVotes,
          voteDetails: voteDetails,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log('Daily results saved:', await response.json());
    } catch (error) {
      console.error('Error saving daily results:', error);
      showMessage('เกิดข้อผิดพลาดในการบันทึกผลโหวตประจำวัน', 'error');
    }
  };

  const handleAdminSetFood = () => {
    if (!adminDirectSelectFoodId) {
      showMessage('ต้องเลือกเมนู', 'error');
      return;
    }

    setDailyMenu({
      status: 'admin_set',
      adminSetFoodItemId: adminDirectSelectFoodId,
      winningFoodItemId: null,
      voteOptions: [],
      votedUsers: {},
      timestamp: new Date().toISOString(),
    });
    showMessage('ตั้งค่าเมนูประจำวันโดยแอดมินเรียบร้อยแล้ว!', 'success');
    setAdminDirectSelectFoodId('');
  };

  const handleVote = (foodItemId) => {
    if (dailyMenu.status !== 'voting') {
      showMessage('ไม่สามารถโหวตได้ในขณะนี้', 'error');
      return;
    }

    if (dailyMenu.votedUsers && dailyMenu.votedUsers[userId]) {
      showMessage('คุณโหวตไปแล้วสำหรับวันนี้!', 'info');
      return;
    }

    const updatedVoteOptions = dailyMenu.voteOptions.map(option =>
      option.foodItemId === foodItemId
        ? { ...option, votes: option.votes + 1 }
        : option
    );

    setDailyMenu(prev => ({
      ...prev,
      voteOptions: updatedVoteOptions,
      votedUsers: {
        ...prev.votedUsers,
        [userId]: foodItemId,
      },
      timestamp: new Date().toISOString(),
    }));
    showMessage('โหวตสำเร็จ!', 'success');
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