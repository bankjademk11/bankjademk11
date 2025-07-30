import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import {
  Header,
  Navigation,
  MessageDisplay,
  ThankYouPopup, // Import ThankYouPopup
} from './components';
import MyFoodsPage from './pages/MyFoodsPage';
import VotePage from './pages/VotePage';
import AdminPage from './pages/AdminPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import DailyReportDetail from './components/admin/DailyReportDetail';

const App = () => {
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const [message, setMessage] = useState({ text: '', type: '' });
  const [showThankYouPopup, setShowThankYouPopup] = useState(false); // New state for popup

  const showMessage = useCallback((text, type) => {
    setMessage({ text, type });
    setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 3000);
  }, [setMessage]);

  const handleCloseThankYouPopup = () => {
    setShowThankYouPopup(false);
  };

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

  const [adminVoteSelections, setAdminVoteSelections] = useState([]);

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
        showMessage('ບໍ່ສາມາດໂຫຼດລາຍການອາຫານໄດ້', 'error');
      }
    };

    fetchFoodItems();
  }, [BACKEND_URL, showMessage]);

  

  const handleAdminLogin = () => {
    if (adminPasswordInput === ADMIN_PASSWORD) {
      setIsAdmin(true);
      showMessage('ເຂົ້າສູ່ລະບົບແອັດມິນສຳເລັດແລ້ວ!', 'success');
    } else {
      showMessage('ລະຫັດຜ່ານແອັດມິນບໍ່ຖືກຕ້ອງ', 'error');
    }
    setAdminPasswordInput('');
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    showMessage('ອອກຈາກລະບົບແອັດມິນແລ້ວ', 'info');
  };

  const toggleAdminVoteSelection = (food) => {
    const isSelected = adminVoteSelections.some(item => item.id === food.id);
    if (isSelected) {
      setAdminVoteSelections(adminVoteSelections.filter(item => item.id !== food.id));
    } else {
      if (adminVoteSelections.length < 5) {
        setAdminVoteSelections([...adminVoteSelections, food]);
      } else {
        showMessage('ເລືອກໄດ້ສູງສຸດ 5 ເມນູສຳລັບໂຫວດເທົ່ານັ້ນ', 'info');
      }
    }
  };

  

  const handleVote = async (foodPackIndex) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/daily-menu/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, foodPackIndex }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to vote');
      }
      // No setDailyMenu here, as VotePage now fetches its own dailyMenu
      const data = await response.json();
      setShowThankYouPopup(true); // Show popup on success
      // No showMessage here, as popup will handle the message
      return data; // Return the updated dailyMenu data
    } catch (error) {
      console.error("Error voting:", error);
      showMessage(error.message === 'User has already voted.' ? 'ທ່ານໂຫວດໄປແລ້ວສຳລັບມື້ນີ້!' : 'ເກີດຂໍ້ຜິດພາດໃນການໂຫວດ', 'error');
      throw error; // Re-throw the error so VotePage can catch it
    }
  };

  const handleCancelVote = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/daily-menu/vote/${userId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to cancel vote');
      }
      const data = await response.json();
      showMessage('ຍົກເລີກການໂຫວດສຳເລັດແລ້ວ!', 'success');
      return data; // Return the updated dailyMenu data
    } catch (error) {
      console.error("Error canceling vote:", error);
      showMessage('ເກີດຂໍ້ຜິດພາດໃນການຍົກເລີກການໂຫວດ', 'error');
      throw error; // Re-throw the error so VotePage can catch it
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
      showMessage('ສົ່ງຄຳເຫັນສຳເລັດແລ້ວ!', 'success');
    } catch (error) {
      console.error("Error submitting review:", error);
      showMessage('ເກີດຂໍ້ຜິດພາດໃນການສົ່ງຄຳເຫັນ', 'error');
    }
  }, [BACKEND_URL, userId, showMessage]);

  

  return (
    <BrowserRouter>
      <div className="min-h-screen p-4 text-gray-800 bg-cover bg-center bg-fixed font-montserrat" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/BG.png)` }}>
        <Header userId={userId} />
        <MessageDisplay message={message} />
        <Navigation isAdmin={isAdmin} />

        <ThankYouPopup
          show={showThankYouPopup}
          onClose={handleCloseThankYouPopup}
          message="ຂອບໃຈທີ່ທ່ານໂຫວດ"
        />

        <Routes>
          <Route path="/" element={<Navigate to="/vote" replace />} />
          <Route path="/vote" element={
            <VotePage
              userId={userId}
              onVoteFromApp={handleVote}
              handleReviewSubmit={handleReviewSubmit}
              foodItems={foodItems}
              onCancelVoteFromApp={handleCancelVote}
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
              setFoodItems={setFoodItems}
              adminVoteSelections={adminVoteSelections}
              setAdminVoteSelections={setAdminVoteSelections}
              toggleAdminVoteSelection={toggleAdminVoteSelection}
              showMessage={showMessage}
              BACKEND_URL={BACKEND_URL}
            />
          } />
          <Route path="/admin/my-foods" element={
            <MyFoodsPage
              BACKEND_URL={BACKEND_URL}
              showMessage={showMessage}
              foodItems={foodItems}
              setFoodItems={setFoodItems}
            />
          } />
          <Route path="/report/:id" element={<DailyReportDetail BACKEND_URL={BACKEND_URL} showMessage={showMessage} />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage BACKEND_URL={BACKEND_URL} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;