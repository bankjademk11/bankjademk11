import React, { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import VoteSelection from './VoteSelection';
import DailyMenuControl from './DailyMenuControl';
import GMReport from './GMReport'; // Import GMReport
import DailyMenuStatus from './DailyMenuStatus';

const AdminDashboard = ({
  isAdmin,
  adminPasswordInput,
  setAdminPasswordInput,
  handleAdminLogin,
  handleAdminLogout,
  foodItems,
  adminVoteSelections,
  setAdminVoteSelections,
  toggleAdminVoteSelection,
  showMessage,
  BACKEND_URL, // Receive BACKEND_URL prop
}) => {
  const [adminView, setAdminView] = useState('voting'); // 'voting' or 'report'
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // YYYY-MM-DD
  const [dailyMenu, setDailyMenu] = useState({ status: 'loading' });
  const [adminDirectSelectFoodId, setAdminDirectSelectFoodId] = useState('');
  const [selectedAdminCategory, setSelectedAdminCategory] = useState('ทั้งหมด');

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
        showMessage('ไม่สามารถโหลดข้อมูลเมนูประจำวันได้', 'error');
      }
    };

    if (selectedDate) {
      fetchDailyMenu();
    }
  }, [BACKEND_URL, selectedDate, showMessage]);

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
        body: JSON.stringify({ date: selectedDate, voteOptions }),
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
      const response = await fetch(`${BACKEND_URL}/api/daily-menu/close`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: selectedDate }),
      });
      if (!response.ok) throw new Error('Failed to close voting');
      const data = await response.json();
      setDailyMenu(data);
      const winningFood = foodItems.find(f => f.id === data.winning_food_item_id);
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
        body: JSON.stringify({ date: selectedDate, foodId: adminDirectSelectFoodId }),
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

  return (
    <section className="max-w-3xl p-8 mx-auto mb-10 bg-white border border-teal-200 shadow-2xl rounded-2xl">
      <h2 className="mb-6 text-3xl font-bold text-center text-teal-700">แผงควบคุมแอดมิน</h2>

      {!isAdmin ? (
        <AdminLogin
          adminPasswordInput={adminPasswordInput}
          setAdminPasswordInput={setAdminPasswordInput}
          handleAdminLogin={handleAdminLogin}
        />
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-2">
              <button
                onClick={() => setAdminView('voting')}
                className={`px-4 py-2 rounded-lg shadow-lg transition ${adminView === 'voting' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                จัดการโหวต
              </button>
              <button
                onClick={() => setAdminView('report')}
                className={`px-4 py-2 rounded-lg shadow-lg transition ${adminView === 'report' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                รายงาน
              </button>
              <button
                onClick={() => setAdminView('status')}
                className={`px-4 py-2 rounded-lg shadow-lg transition ${adminView === 'status' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                สถานะเมนู
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="date-picker" className="text-gray-700">เลือกวันที่:</label>
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
              ออกจากระบบ
            </button>
          </div>

          {adminView === 'voting' && (
            <>
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
              />

              <DailyMenuControl
                dailyMenuStatus={dailyMenu.status}
                handleCloseVoting={handleCloseVoting}
                adminDirectSelectFoodId={adminDirectSelectFoodId}
                setAdminDirectSelectFoodId={setAdminDirectSelectFoodId}
                handleAdminSetFood={handleAdminSetFood}
                foodItems={foodItems}
              />
            </>
          )}

          {adminView === 'report' && (
            <GMReport BACKEND_URL={BACKEND_URL} showMessage={showMessage} />
          )}

          {adminView === 'status' && (
            <DailyMenuStatus BACKEND_URL={BACKEND_URL} showMessage={showMessage} foodItems={foodItems} />
          )}
        </>
      )}
    </section>
  );
};

export default AdminDashboard;