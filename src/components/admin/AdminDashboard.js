import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import AdminLogin from './AdminLogin';
import VoteSelection from './VoteSelection';
import DailyMenuControl from './DailyMenuControl';
import GMReport from './GMReport'; // Import GMReport
import DailyMenuStatus from './DailyMenuStatus';
import FoodManagement from './FoodManagement'; // Import FoodManagement

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
  BACKEND_URL, // Receive BACKEND_URL prop
}) => {
  const [adminView, setAdminView] = useState('status'); // 'voting' or 'report'
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // YYYY-MM-DD
  const [dailyMenu, setDailyMenu] = useState({ status: 'loading' });
  const [adminDirectSelectFoodId, setAdminDirectSelectFoodId] = useState('');
  const [selectedAdminCategory, setSelectedAdminCategory] = useState('ທັງໝົດ');
  const [editingVoteOptions, setEditingVoteOptions] = useState(null); // New state for editing
  const [editingDate, setEditingDate] = useState(null); // New state for editing date

  // New states for lifting state up from VoteSelection
  const [adminFinalVotePacks, setAdminFinalVotePacks] = useState([]);
  const [adminSelectedFoodForPack, setAdminSelectedFoodForPack] = useState([]);

  useEffect(() => {
    const fetchDailyMenu = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/daily-menu/${selectedDate}`);
        if (response.status === 404) {
          // If no entry for this date, set to idle
          setDailyMenu({
            status: 'idle',
            vote_options: [],
            voted_users: {},
            winning_food_item_id: null,
            admin_set_food_item_id: null,
            timestamp: null,
            date: selectedDate,
          });
          return;
        }
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDailyMenu(data);
      } catch (error) {
        console.error("Error fetching daily menu for date:", error);
        showMessage('ບໍ່ສາມາດໂຫຼດຂໍ້ມູນເມນູປະຈຳວັນໄດ້', 'error');
      }
    };

    if (selectedDate) {
      fetchDailyMenu();
    }
  }, [BACKEND_URL, selectedDate, showMessage]);

  const handleStartVoting = async (votePacks) => {
    if (!votePacks || votePacks.length === 0) {
      showMessage('ກະລຸນາເພີ່ມຢ່າງໜ້ອຍໜຶ່ງຊຸດອາຫານເພື່ອເລີ່ມການໂຫວດ.', 'error');
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/daily-menu/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voteOptions: votePacks, date: selectedDate }),
      });
      if (!response.ok) throw new Error('Failed to start voting');
      const data = await response.json();
      setDailyMenu(data);
      showMessage('ເລີ່ມການໂຫວດຊຸດອາຫານປະຈຳວັນແລ້ວ!', 'success');
      setEditingVoteOptions(null); // Clear editing state after starting new vote
      setEditingDate(null);
      setAdminFinalVotePacks([]); // Clear vote packs after starting vote
      setAdminSelectedFoodForPack([]); // Clear selected food for pack
    } catch (error) {
      console.error("Error starting voting:", error);
      showMessage('ເກີດຂໍ້ຜິດພາດໃນການເລີ່ມໂຫວດ', 'error');
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
    setEditingVoteOptions(null); // Clear editing state when creating new
    setEditingDate(null);
    setAdminFinalVotePacks([]); // Clear vote packs when creating new
    setAdminSelectedFoodForPack([]); // Clear selected food for pack
  };

  const handleEditMenuAndNavigateToVoting = (date, voteOptions) => {
    setSelectedDate(date);
    setEditingVoteOptions(voteOptions);
    setEditingDate(date);
    setAdminView('voting');
    // Pre-populate adminFinalVotePacks and adminSelectedFoodForPack for editing
    if (voteOptions) {
      const packsToLoad = voteOptions.map(pack => pack.foodIds);
      setAdminFinalVotePacks(packsToLoad);
      setAdminSelectedFoodForPack([]); // Clear current selection for pack
    } else {
      setAdminFinalVotePacks([]);
      setAdminSelectedFoodForPack([]);
    }
  };

  return (
    <section className="p-8 mb-10 bg-white border border-teal-200 shadow-2xl rounded-2xl">
      <h2 className="mb-6 text-3xl font-bold text-center text-teal-700">ແຜງຄວບຄຸມແອັດມິນ</h2>

      {!isAdmin ? (
        <AdminLogin
          adminPasswordInput={adminPasswordInput}
          setAdminPasswordInput={setAdminPasswordInput}
          handleAdminLogin={handleAdminLogin}
        />
      ) : (
        <>
          <div className="flex flex-wrap justify-between items-center mb-4">
            <div className="flex flex-wrap space-x-2 space-y-2 sm:space-y-0">
              <button
                onClick={() => setAdminView('report')}
                className={`px-4 py-2 rounded-lg shadow-lg transition ${adminView === 'report' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                ລາຍງານ
              </button>
              <button
                onClick={() => setAdminView('status')}
                className={`px-4 py-2 rounded-lg shadow-lg transition ${adminView === 'status' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                ສະຖານະເມນູ
              </button>
              <button
                onClick={() => setAdminView('food-management')}
                className={`px-4 py-2 rounded-lg shadow-lg transition ${adminView === 'food-management' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                ຈັດການອາຫານ
              </button>
              <button
                onClick={() => setAdminView('admin-set-menu')}
                className={`px-4 py-2 rounded-lg shadow-lg transition ${adminView === 'admin-set-menu' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                ຕັ້ງຄ່າເມນູປະຈຳວັນ
              </button>
              <Link to="/admin/dashboard" className="px-4 py-2 rounded-lg shadow-lg transition bg-blue-500 text-white hover:bg-blue-600">
                ເບິ່ງ Dashboard
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="date-picker" className="text-gray-700">ເລືອກວັນທີ:</label>
              <input
                type="date"
                id="date-picker"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="p-2 border border-gray-300 rounded-md"
              />
            </div>
            <button
              onClick={handleAdminLogout}
              className="px-4 py-2 text-sm font-bold text-white transition duration-300 bg-red-500 rounded-lg hover:bg-red-600"
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
              dailyMenuStatus={dailyMenu.status}
              showMessage={showMessage}
              selectedAdminCategory={selectedAdminCategory}
              setSelectedAdminCategory={setSelectedAdminCategory}
              selectedDate={selectedDate} // Pass selectedDate to VoteSelection
              editingVoteOptions={editingVoteOptions} // Pass editingVoteOptions
              editingDate={editingDate} // Pass editingDate
              adminFinalVotePacks={adminFinalVotePacks} // Pass lifted state
              setAdminFinalVotePacks={setAdminFinalVotePacks} // Pass setter
              adminSelectedFoodForPack={adminSelectedFoodForPack} // Pass lifted state
              setAdminSelectedFoodForPack={setAdminSelectedFoodForPack} // Pass setter
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
              selectedDate={selectedDate} // Pass selectedDate to DailyMenuControl
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
              onCreateMenuAndNavigate={handleCreateMenuAndNavigateToVoting} // Pass the new handler
              selectedDate={selectedDate} // Pass selectedDate to DailyMenuStatus
              setSelectedDate={setSelectedDate} // Pass setSelectedDate to DailyMenuStatus
              handleCloseVoting={handleCloseVoting} // Pass handleCloseVoting to DailyMenuStatus
              handleEditMenuAndNavigateToVoting={handleEditMenuAndNavigateToVoting} // Pass handleEditMenuAndNavigateToVoting
            />
          )}

          {adminView === 'food-management' && (
            <FoodManagement BACKEND_URL={BACKEND_URL} showMessage={showMessage} foodItems={foodItems} setFoodItems={setFoodItems} />
          )}
        </>
      )}
    </section>
  );
};

export default AdminDashboard;