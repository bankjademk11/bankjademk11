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
  const [foodItems, setFoodItems] = useState(() => {
    const savedFoodItems = localStorage.getItem('thaiFoodMenu_foodItems');
    return savedFoodItems ? JSON.parse(savedFoodItems) : [
      { id: '1', name: 'ผัดไทย', image: 'https://placehold.co/400x300/FFD700/000000?text=Pad+Thai', tags: ['อาหารจานเดียว', 'เส้น', 'ยอดนิยม', 'ทั่วไป'] },
      { id: '2', name: 'ต้มยำกุ้ง', image: 'https://placehold.co/400x300/FF6347/FFFFFF?text=Tom+Yum+Goong', tags: ['ซุป', 'เผ็ด', 'อาหารทะเล', 'ทั่วไป'] },
      { id: '3', name: 'แกงเขียวหวาน', image: 'https://placehold.co/400x300/32CD32/FFFFFF?text=Green+Curry', tags: ['แกง', 'กะทิ', 'เผ็ดน้อย', 'ทั่วไป'] },
      { id: '4', name: 'ข้าวผัด', image: 'https://placehold.co/400x300/87CEEB/000000?text=Fried+Rice', tags: ['อาหารจานเดียว', 'ข้าว', 'ง่ายๆ', 'ทั่วไป'] },
      { id: '5', name: 'ส้มตำ', image: 'https://placehold.co/400x300/FF4500/FFFFFF?text=Som+Tum', tags: ['สลัด', 'เผ็ด', 'อีสาน', 'ทั่วไป'] },
      { id: '6', name: 'มัสมั่นไก่', image: 'https://placehold.co/400x300/8B4513/FFFFFF?text=Massaman+Curry', tags: ['แกง', 'กะทิ', 'ไม่เผ็ด', 'ทั่วไป'] },
      { id: '7', name: 'ราดหน้าหมู', image: 'https://placehold.co/400x300/90EE90/000000?text=Rad+Na+Moo', tags: ['อาหารจานเดียว', 'เส้น', 'อาหารราดหน้า'] },
      { id: '8', name: 'ก๋วยเตี๋ยวเรือ', image: 'https://placehold.co/400x300/DDA0DD/FFFFFF?text=Boat+Noodle', tags: ['อาหารจานเดียว', 'เส้น'] },
    ];
  });

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
    localStorage.setItem('thaiFoodMenu_foodItems', JSON.stringify(foodItems));
  }, [foodItems]);

  useEffect(() => {
    localStorage.setItem('thaiFoodMenu_dailyMenu', JSON.stringify(dailyMenu));
  }, [dailyMenu]);

  // --- CRUD Operations for Food Items (using localStorage) ---
  const handleAddOrUpdateFood = (e) => {
    e.preventDefault();

    if (!foodName.trim() || !foodImage.trim()) {
      showMessage('กรุณากรอกชื่อและรูปภาพอาหาร', 'error');
      return;
    }

    const tagsArray = foodTags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

    if (editingFoodId) {
      // Update existing food item
      setFoodItems(foodItems.map(item =>
        item.id === editingFoodId
          ? { ...item, name: foodName, image: foodImage, tags: tagsArray }
          : item
      ));
      showMessage('อัปเดตเมนูอาหารเรียบร้อยแล้ว!', 'success');
      setEditingFoodId(null);
    } else {
      // Add new food item
      const newFoodItem = {
        id: Date.now().toString(), // Unique ID based on timestamp
        name: foodName,
        image: foodImage,
        tags: tagsArray,
      };
      setFoodItems([...foodItems, newFoodItem]);
      showMessage('เพิ่มเมนูอาหารเรียบร้อยแล้ว!', 'success');
    }

    // Clear form fields
    setFoodName('');
    setFoodImage('');
    setFoodTags('');
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

  const handleDeleteFood = (id) => {
    if (window.confirm('คุณต้องการลบเมนูอาหารนี้หรือไม่?')) {
      setFoodItems(foodItems.filter(item => item.id !== id));
      showMessage('ลบเมนูอาหารเรียบร้อยแล้ว!', 'success');
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
            />
          ) : (
            <DailyWinner
              winningFood={winningFood}
              dailyMenuStatus={dailyMenu.status}
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