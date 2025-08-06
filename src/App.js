import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import {
  Header,
  Navigation,
  MessageDisplay,
  ThankYouPopup,
  Footer,
} from './components';
import MyFoodsPage from './pages/MyFoodsPage';
import VotePage from './pages/VotePage';
import AdminPage from './pages/AdminPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import DailyReportDetail from './components/admin/DailyReportDetail';
import LineLoginHandler from './pages/LineLoginHandler';
import blackgroundImage from './assets/blackground.png';

const App = () => {
  
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const [message, setMessage] = useState({ text: '', type: '' });
  const [showThankYouPopup, setShowThankYouPopup] = useState(false);

  const showMessage = useCallback((text, type) => {
    setMessage({ text, type });
    setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 3000);
  }, [setMessage]);

  const handleCloseThankYouPopup = () => {
    setShowThankYouPopup(false);
  };

  const [userId, setUserId] = useState(localStorage.getItem('offlineUserId'));

  useEffect(() => {
    const handleStorageChange = () => {
      setUserId(localStorage.getItem('offlineUserId'));
    };

    window.addEventListener('storage', handleStorageChange);

    // Listen for a custom event that LineLoginHandler can dispatch
    const handleUserLoggedIn = () => {
      setUserId(localStorage.getItem('offlineUserId'));
    };
    window.addEventListener('userLoggedIn', handleUserLoggedIn);


    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userLoggedIn', handleUserLoggedIn);
    };
  }, []);

  const [isAdmin, setIsAdmin] = useState(() => {
    const storedAdminStatus = localStorage.getItem('isAdmin');
    return storedAdminStatus === 'true'; // Convert string to boolean
  });
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

  useEffect(() => {
    const registerUser = async () => {
      if (userId) {
        try {
          await fetch(`${BACKEND_URL}/api/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId }),
          });
        } catch (error) {
          console.error("Error registering user:", error);
        }
      }
    };

    registerUser();
  }, [userId, BACKEND_URL]);

  

  const handleAdminLogin = () => {
    if (adminPasswordInput === ADMIN_PASSWORD) {
      setIsAdmin(true);
      localStorage.setItem('isAdmin', 'true'); // Save admin status
      showMessage('ເຂົ້າສູ່ລະບົບແອັດມິນສຳເລັດແລ້ວ!', 'success');
    } else {
      showMessage('ລະຫັດຜ່ານແອັດມິນບໍ່ຖືກຕ້ອງ', 'error');
    }
    setAdminPasswordInput('');
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('isAdmin'); // Remove admin status
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

  

  const handleVote = async (foodPackIndex, date) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/daily-menu/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, foodPackIndex, date }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to vote');
      }
      const data = await response.json();
      setShowThankYouPopup(true);
      return data;
    } catch (error) {
      console.error("Error voting:", error);
      showMessage(error.message === 'User has already voted.' ? 'ທ່ານໂຫວດໄປແລ້ວສຳລັບມື້ນີ້!' : 'ເກີດຂໍ້ຜິດພາດໃນການໂຫວດ', 'error');
      throw error;
    }
  };

  const handleCancelVote = async (date) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/daily-menu/vote/${userId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to cancel vote');
      }
      const data = await response.json();
      showMessage('ຍົກເລີກການໂຫວດສຳເລັດແລ້ວ!', 'success');
      return data;
    } catch (error) {
      console.error("Error canceling vote:", error);
      showMessage('ເກີດຂໍ້ຜິດພາດໃນການຍົກເລີກການໂຫວດ', 'error');
      throw error;
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
      <div className="relative min-h-screen font-sans text-neutral-800">
        {/* Background Image with Blur */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-fixed filter blur-sm"
          style={{ backgroundImage: `url(${blackgroundImage})` }}
        ></div>

        {/* Content Wrapper */}
        <div className="relative z-10 flex flex-col min-h-screen">
          <Header userId={userId} />
          <MessageDisplay message={message} />
          <Navigation isAdmin={isAdmin} />

          <ThankYouPopup
            show={showThankYouPopup}
            onClose={handleCloseThankYouPopup}
            message="ຂອບໃຈທີ່ທ່ານໂຫວດ"
          />

          {/* Main content area that grows to push footer down */}
          <main className="flex-grow">
            <Routes>
              <Route path="/line_login" element={<LineLoginHandler />} />
              <Route path="/" element={<Navigate to="/vote" replace />} />
              <Route path="/vote" element={
                userId ? (
                  <VotePage
                    userId={userId}
                    onVoteFromApp={handleVote}
                    handleReviewSubmit={handleReviewSubmit}
                    foodItems={foodItems}
                    onCancelVoteFromApp={handleCancelVote}
                  />
                ) : (
                  <div className="flex items-center justify-center h-screen text-primary text-xl font-bold text-center">
                    ກະລຸນາເຂົ້າສູ່ລະບົບຜ່ານລິ້ງ LINE ທີ່ທ່ານໄດ້ຮັບ.
                  </div>
                )
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
          </main>
          
          <Footer userId={userId} />
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
