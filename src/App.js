import React, { useState, useEffect } from 'react';
import {
  Header,
  Navigation,
  MessageDisplay,
  FoodForm,
  FoodList,
  CategoryFilter,
  VotingSection,
  DailyWinner,
  AdminDashboard,
} from './components'; // Importing from the index.js barrel file

const App = () => {
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  // State for current page view: 'my_foods', 'vote', 'admin'
  const [currentPage, setCurrentPage] = useState('my_foods');

  // User ID for offline voting (persists per browser session)
  // eslint-disable-next-line no-unused-vars
  const [userId, setUserId] = useState(() => {
    let id = localStorage.getItem('offlineUserId');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('offlineUserId', id);
    }
    return id;
  });

  // Simple admin state for offline demo (not secure for real apps)
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const ADMIN_PASSWORD = 'admin'; // Hardcoded admin password for demo

  // State to store the list of food items (user's private list)
  const [foodItems, setFoodItems] = useState([]);

  // --- Fetch food items from backend ---
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
  }, [BACKEND_URL]); // Added BACKEND_URL to dependency array

  // State for the daily menu/voting status (public, stored in localStorage)
  const [dailyMenu, setDailyMenu] = useState(() => {
    const savedDailyMenu = localStorage.getItem('thaiFoodMenu_dailyMenu');
    return savedDailyMenu ? JSON.parse(savedDailyMenu) : {
      status: 'idle', // 'idle', 'voting', 'closed', 'admin_set'
      voteOptions: [],
      votedUsers: {}, // { userId: foodItemId }
      winningFoodItemId: null,
      adminSetFoodItemId: null,
      timestamp: null,
    };
  });

  // State for the form inputs (for adding/editing food items)
  const [foodName, setFoodName] = useState('');
  const [foodImage, setFoodImage] = useState('');
  const [foodTags, setFoodTags] = useState('');
  const [editingFoodId, setEditingFoodId] = useState(null);

  // State for admin panel: selected items for voting (stores full food objects)
  const [adminVoteSelections, setAdminVoteSelections] = useState([]);
  const [adminDirectSelectFoodId, setAdminDirectSelectFoodId] = useState('');

  // State for filtering food items in 'my_foods' page
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด'); // 'ทั้งหมด', 'อาหารราดหน้า', 'ทั่วไป', 'เส้น'
  // State for filtering food items in 'admin' page
  const [selectedAdminCategory, setSelectedAdminCategory] = useState('ทั้งหมด'); // 'ทั้งหมด', 'อาหารราดหน้า', 'ทั่วไป', 'เส้น'

  // State for showing success/error messages
  const [message, setMessage] = useState({ text: '', type: '' });

  // --- Effects to save data to Local Storage ---
  useEffect(() => {
    // localStorage.setItem('thaiFoodMenu_foodItems', JSON.stringify(foodItems)); // No longer needed, managed by backend
  }, [foodItems]);

  useEffect(() => {
    localStorage.setItem('thaiFoodMenu_dailyMenu', JSON.stringify(dailyMenu));
  }, [dailyMenu]);

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

  const handleEditFood = (id) => {
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

  // --- Admin Functions (using localStorage) ---
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

  // Toggle selection for voting in admin panel
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
      votedUsers: {}, // Reset voted users
      winningFoodItemId: null,
      adminSetFoodItemId: null,
      timestamp: new Date().toISOString(),
    });
    showMessage('เริ่มการโหวตเมนูประจำวันแล้ว!', 'success');
    setAdminVoteSelections([]); // Clear selected items after starting vote
  };

  const handleCloseVoting = () => {
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

  // --- User Voting Function (using localStorage) ---
  const handleVote = (foodItemId) => {
    if (dailyMenu.status !== 'voting') {
      showMessage('ไม่สามารถโหวตได้ในขณะนี้', 'error');
      return;
    }

    // Check if user has already voted
    if (dailyMenu.votedUsers && dailyMenu.votedUsers[userId]) {
      showMessage('คุณโหวตไปแล้วสำหรับวันนี้!', 'info');
      return;
    }

    // Update the vote count for the selected item and mark user as voted
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
        [userId]: foodItemId, // Mark user as voted for this item
      },
      timestamp: new Date().toISOString(),
    }));
    showMessage('โหวตสำเร็จ!', 'success');
  };

  // --- Review Submission Function ---
  // eslint-disable-next-line no-unused-vars
  const handleReviewSubmit = async (foodId, rating, comment) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/foods/${foodId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating, comment, userId }), // Pass userId from App.js state
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newReview = await response.json();
      console.log('Review submitted:', newReview);
      showMessage('ส่งรีวิวเรียบร้อยแล้ว!', 'success');
      // Optionally, re-fetch reviews for the food item or update state
    } catch (error) {
      console.error("Error submitting review:", error);
      showMessage('เกิดข้อผิดพลาดในการส่งรีวิว', 'error');
    }
  };

  // Function to display messages
  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => {
      setMessage({ text: '', type: '' }); // Clear message after 3 seconds
    }, 3000);
  };

  // Get winning food item details for display
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

  // Filtered food items for 'my_foods' section
  const filteredFoodItems = foodItems.filter(food => {
    if (selectedCategory === 'ทั้งหมด') {
      return true;
    }
    return food.tags.includes(selectedCategory);
  });

  return (
    <div className="min-h-screen p-4 text-gray-800 bg-gradient-to-br from-emerald-50 to-teal-100 font-inter">
      <Header userId={userId} />
      <MessageDisplay message={message} />
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {currentPage === 'my_foods' && (
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
            filteredFoodItems={filteredFoodItems}
            handleEditFood={handleEditFood}
            handleDeleteFood={handleDeleteFood}
            BACKEND_URL={BACKEND_URL}
          />
        </>
      )}

      {currentPage === 'vote' && (
        <section className="max-w-6xl p-8 mx-auto mb-10 bg-white border border-teal-200 shadow-xl rounded-2xl">
          <h2 className="mb-6 text-3xl font-bold text-center text-teal-700">เมนูประจำวัน</h2>
          {dailyMenu.status === 'voting' ? (
            <VotingSection
              dailyMenu={dailyMenu}
              userId={userId}
              handleVote={handleVote}
              handleReviewSubmit={handleReviewSubmit}
              foodItems={foodItems}
            />
          ) : (
            <DailyWinner
              winningFood={winningFood}
              dailyMenuStatus={dailyMenu.status}
              handleReviewSubmit={handleReviewSubmit}
              userId={userId}
              foodItems={foodItems}
            />
          )}
        </section>
      )}

      {currentPage === 'admin' && (
        <AdminDashboard
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
          dailyMenu={dailyMenu} // Pass the full dailyMenu object
          handleCloseVoting={handleCloseVoting}
          adminDirectSelectFoodId={adminDirectSelectFoodId}
          setAdminDirectSelectFoodId={setAdminDirectSelectFoodId}
          handleAdminSetFood={handleAdminSetFood}
          showMessage={showMessage}
          selectedAdminCategory={selectedAdminCategory}
          setSelectedAdminCategory={setSelectedAdminCategory}
        />
      )}
    </div>
  );
};

export default App;