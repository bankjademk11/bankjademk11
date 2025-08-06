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
  const [adminView, setAdminView] = useState('status');
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

  return (
    <section className="p-8 mb-10 bg-gray-100 bg-opacity-90 rounded-2xl border border-gray-200">
      <h2 className="mb-6 text-3xl font-bold text-center text-primary">ແຜງຄວບຄຸມແອັດມິນ</h2>

      {!isAdmin ? (
        <AdminLogin
          adminPasswordInput={adminPasswordInput}
          setAdminPasswordInput={setAdminPasswordInput}
          handleAdminLogin={handleAdminLogin}
        />
      ) : (
        <>
          <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setAdminView('status')}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 ease-in-out
                  ${adminView === 'status' ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-secondary hover:bg-gray-200'}
                `}
              >
                ສະຖານະເມນູ
              </button>
              <button
                onClick={() => setAdminView('voting')}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 ease-in-out
                  ${adminView === 'voting' ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-secondary hover:bg-gray-200'}
                `}
              >
                ຈັດການໂຫວດ
              </button>
              <button
                onClick={() => setAdminView('food-management')}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 ease-in-out
                  ${adminView === 'food-management' ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-secondary hover:bg-gray-200'}
                `}
              >
                ຈັດການອາຫານ
              </button>
              <button
                onClick={() => setAdminView('report')}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 ease-in-out
                  ${adminView === 'report' ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-secondary hover:bg-gray-200'}
                `}
              >
                ລາຍງານ
              </button>
              <button
                onClick={() => setAdminView('dashboard')}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 ease-in-out
                  ${adminView === 'dashboard' ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-secondary hover:bg-gray-200'}
                `}
              >
                Dashboard
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <label htmlFor="date-picker" className="text-secondary font-semibold">ເລືອກວັນທີ:</label>
              <input
                type="date"
                id="date-picker"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary transition-colors"
              />
            </div>
            <button
              onClick={handleAdminLogout}
              className="px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 ease-in-out bg-red-500 text-white shadow-md hover:bg-red-600"
            >
              ອອກຈາກລະບົບ
            </button>
          </div>

          {adminView === 'voting' && (
            <VoteSelection
              foodItems={foodItems}
              adminVoteSelections={adminVoteSelections}
              setAdminVoteSelections={setAdminVoteSelections}
              toggleAdminVoteSelection={toggleAdminVoteSelection}
              handleStartVoting={handleStartVoting}
              isStartingVote={isStartingVote} // Pass the new state
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
          )}

          {adminView === 'admin-set-menu' && (
            <DailyMenuControl
              dailyMenuStatus={dailyMenu.status}
              handleCloseVoting={handleCloseVoting}
              adminDirectSelectFoodId={adminDirectSelectFoodId}
              setAdminDirectSelectFoodId={setAdminDirectSelectFoodId}
              handleAdminSetFood={handleAdminSetFood}
              foodItems={foodItems}
              selectedDate={selectedDate}
            />
          )}

          {adminView === 'report' && (
            <GMReport BACKEND_URL={BACKEND_URL} showMessage={showMessage} />
          )}

          {adminView === 'status' && (
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
          )}

          {adminView === 'food-management' && (
            <FoodManagement BACKEND_URL={BACKEND_URL} showMessage={showMessage} foodItems={foodItems} setFoodItems={setFoodItems} />
          )}

          {adminView === 'dashboard' && (
            <DailySummary BACKEND_URL={BACKEND_URL} />
          )}
        </>
      )}
    </section>
  );
};

export default AdminDashboard;