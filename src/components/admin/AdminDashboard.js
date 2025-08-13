import React, { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import VoteSelection from './VoteSelection';
import DailyMenuControl from './DailyMenuControl';
import GMReport from './GMReport';
import DailyMenuStatus from './DailyMenuStatus';
import FoodManagement from './FoodManagement';
import DailySummary from './DailySummary';

const AdminDashboard = ({
  isAdmin,
  adminPasswordInput,
  setAdminPasswordInput,
  handleAdminLogin,
  handleAdminLogout,
  foodItems,
  setFoodItems,
  adminVoteSelections,
  setAdminVoteSelections,
  toggleAdminVoteSelection,
  showMessage,
  BACKEND_URL,
}) => {
  const [adminView, setAdminView] = useState('dashboard');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dailyMenu, setDailyMenu] = useState({ status: 'loading' });
  const [adminDirectSelectFoodId, setAdminDirectSelectFoodId] = useState('');
  const [selectedAdminCategory, setSelectedAdminCategory] = useState('ທັງໝົດ');
  const [editingVoteOptions, setEditingVoteOptions] = useState(null);
  const [editingDate, setEditingDate] = useState(null);
  const [isStartingVote, setIsStartingVote] = useState(false);

  const [adminFinalVotePacks, setAdminFinalVotePacks] = useState([]);
  const [adminSelectedFoodForPack, setAdminSelectedFoodForPack] = useState([]);

  useEffect(() => {
    const fetchDailyMenu = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/daily-menu/${selectedDate}`);
        if (response.status === 404) {
          setDailyMenu({
            status: 'idle',
            vote_options: [],
            voted_users: {},
            winning_food_item_id: null,
            admin_set_food_item_id: null,
            timestamp: null,
            date: selectedDate,
          });
          setEditingVoteOptions(null);
          setEditingDate(null);
          setAdminFinalVotePacks([]); // Clear packs if no data for the date
          return;
        }
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDailyMenu(data);

        // Set editing options based on fetched data for the selected date
        if (data.vote_options && Array.isArray(data.vote_options)) {
          setEditingVoteOptions(data.vote_options);
          setEditingDate(selectedDate);
          const packsToLoad = data.vote_options.map(pack => pack.foodIds);
          setAdminFinalVotePacks(packsToLoad);
        } else {
          setEditingVoteOptions(null);
          setEditingDate(null);
          setAdminFinalVotePacks([]); // Clear packs if no vote options for the date
        }

      } catch (error) {
        console.error("Error fetching daily menu for date:", error);
        showMessage('ບໍ່ສາມາດໂຫຼດຂໍ້ມູນເມນູປະຈຳວັນໄດ້', 'error');
      }
    };

    if (selectedDate) {
      fetchDailyMenu();
    }
  }, [BACKEND_URL, selectedDate, showMessage, adminView, editingVoteOptions]);

  const handleStartVoting = async (votePacks) => {
    if (!votePacks || votePacks.length === 0) {
      showMessage('ກະລຸນາເພີ່ມຢ່າງໜ້ອຍໜຶ່ງຊຸດອາຫານເພື່ອເລີ່ມການໂຫວດ.', 'error');
      return;
    }
    setIsStartingVote(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/daily-menu/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voteOptions: votePacks, date: selectedDate }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to start voting');
      }
      const data = await response.json();
      setDailyMenu(data);
      showMessage('ເລີ່ມການໂຫວດຊຸດອາຫານປະຈຳວັນແລ້ວ!', 'success');
      setEditingVoteOptions(null);
      setEditingDate(null);
      setAdminFinalVotePacks([]);
      setAdminSelectedFoodForPack([]);
    } catch (error) {
      console.error("Error starting voting:", error);
      showMessage('ເກີດຂໍ້ຜິດພາດໃນການເລີ່ມໂຫວດ', 'error');
    } finally {
      setIsStartingVote(false);
    }
  };

  const handleCloseVoting = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/daily-menu/close`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: selectedDate }),
      });
      if (!response.ok) throw new Error('Failed to close voting');
      const data = await response.json();
      setDailyMenu(data);
      const winningFood = foodItems.find(f => f.id === data.winning_food_item_id);
      showMessage(`ປິດການໂຫວດແລ້ວ! ເມນູທີ່ຊະນະແມ່ນ ${winningFood ? winningFood.name : 'ບໍ່ມີ'}`, 'success');
    } catch (error) {
      console.error("Error closing voting:", error);
      showMessage('ເກີດຂໍ້ຜິດພາດໃນການປິດໂຫວດ', 'error');
    }
  };

  const handleAdminSetFood = async () => {
    if (!adminDirectSelectFoodId) {
      showMessage('ຕ້ອງເລືອກເມນູ', 'error');
      return;
    }
    try {
      const response = await fetch(`${BACKEND_URL}/api/daily-menu/admin-set`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: selectedDate, foodId: adminDirectSelectFoodId }),
      });
      if (!response.ok) throw new Error('Failed to set food by admin');
      const data = await response.json();
      setDailyMenu(data);
      showMessage('ຕັ້ງຄ່າເມນູປະຈຳວັນໂດຍແອັດມິນສຳເລັດແລ້ວ!', 'success');
      setAdminDirectSelectFoodId('');
    } catch (error) {
      console.error("Error setting food by admin:", error);
      showMessage('ເກີດຂໍ້ຜິດພາດໃນການຕັ້ງຄ່າເມນູ', 'error');
    }
  };

  const handleCreateMenuAndNavigateToVoting = (date) => {
    setSelectedDate(date);
    setAdminView('voting');
    setEditingVoteOptions(null);
    setEditingDate(null);
    setAdminFinalVotePacks([]);
    setAdminSelectedFoodForPack([]);
  };

  const handleEditMenuAndNavigateToVoting = (date, voteOptions) => {
    // Ensure the date is in YYYY-MM-DD format for the input field
    const formattedDate = new Date(date).toISOString().split('T')[0];
    setSelectedDate(formattedDate);
    setEditingVoteOptions(voteOptions);
    setEditingDate(formattedDate);
    setAdminView('voting');
    if (voteOptions) {
      const packsToLoad = voteOptions.map(pack => pack.foodIds);
      setAdminFinalVotePacks(packsToLoad);
      setAdminSelectedFoodForPack([]);
    } else {
      setAdminFinalVotePacks([]);
      setAdminSelectedFoodForPack([]);
    }
  };

  // Navigation items with icons
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'status', label: 'ສະຖານະເມນູ', icon: '📋' },
    { id: 'voting', label: 'ຈັດການໂຫວດ', icon: '🗳️' },
    { id: 'food-management', label: 'ຈັດການອາຫານ', icon: '🍽️' },
    { id: 'report', label: 'ລາຍງານ', icon: '📈' },
  ];

  // If user is not admin, don't render anything here - let the parent component handle it
  if (!isAdmin) {
    return null;
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">ຜູ້ດູແລລະບົບ (Admin Panel)</h1>
          <p className="text-gray-600 mt-2">ຈັດການລະບົບອາຫານປະຈຳວັນ</p>
        </div>

        {/* Navigation Bar - Responsive */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 md:pb-0">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setAdminView(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap
                    ${adminView === item.id 
                      ? 'bg-teal-600 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                  `}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <label htmlFor="date-picker" className="text-gray-700 font-medium whitespace-nowrap">ເລືອກວັນທີ:</label>
                <input
                  type="date"
                  id="date-picker"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                />
              </div>
              <button
                onClick={handleAdminLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors whitespace-nowrap"
              >
                <span>ອອກຈາກລະບົບ</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {adminView === 'voting' && (
            <div className="p-4 md:p-6">
              <VoteSelection
                foodItems={foodItems}
                adminVoteSelections={adminVoteSelections}
                setAdminVoteSelections={setAdminVoteSelections}
                toggleAdminVoteSelection={toggleAdminVoteSelection}
                handleStartVoting={handleStartVoting}
                isStartingVote={isStartingVote}
                showMessage={showMessage}
                selectedAdminCategory={selectedAdminCategory}
                setSelectedAdminCategory={setSelectedAdminCategory}
                selectedDate={selectedDate}
                editingVoteOptions={editingVoteOptions}
                editingDate={editingDate}
                adminFinalVotePacks={adminFinalVotePacks}
                setAdminFinalVotePacks={setAdminFinalVotePacks}
                adminSelectedFoodForPack={adminSelectedFoodForPack}
                setAdminSelectedFoodForPack={setAdminSelectedFoodForPack}
              />
            </div>
          )}

          {adminView === 'admin-set-menu' && (
            <div className="p-4 md:p-6">
              <DailyMenuControl
                dailyMenuStatus={dailyMenu.status}
                handleCloseVoting={handleCloseVoting}
                adminDirectSelectFoodId={adminDirectSelectFoodId}
                setAdminDirectSelectFoodId={setAdminDirectSelectFoodId}
                handleAdminSetFood={handleAdminSetFood}
                foodItems={foodItems}
                selectedDate={selectedDate}
              />
            </div>
          )}

          {adminView === 'report' && (
            <div className="p-4 md:p-6">
              <GMReport BACKEND_URL={BACKEND_URL} showMessage={showMessage} />
            </div>
          )}

          {adminView === 'status' && (
            <div className="p-4 md:p-6">
              <DailyMenuStatus
                BACKEND_URL={BACKEND_URL}
                showMessage={showMessage}
                foodItems={foodItems}
                onCreateMenuAndNavigate={handleCreateMenuAndNavigateToVoting}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                handleCloseVoting={handleCloseVoting}
                handleEditMenuAndNavigateToVoting={handleEditMenuAndNavigateToVoting}
              />
            </div>
          )}

          {adminView === 'food-management' && (
            <div className="p-4 md:p-6">
              <FoodManagement 
                BACKEND_URL={BACKEND_URL} 
                showMessage={showMessage} 
                foodItems={foodItems} 
                setFoodItems={setFoodItems} 
              />
            </div>
          )}

          {adminView === 'dashboard' && (
            <div className="p-0">
              <DailySummary BACKEND_URL={BACKEND_URL} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;