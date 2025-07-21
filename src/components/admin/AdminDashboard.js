import React, { useState } from 'react';
import AdminLogin from './AdminLogin';
import VoteSelection from './VoteSelection';
import DailyMenuControl from './DailyMenuControl';
import GMReport from './GMReport'; // Import GMReport

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
  handleStartVoting,
  dailyMenu,
  handleCloseVoting,
  adminDirectSelectFoodId,
  setAdminDirectSelectFoodId,
  handleAdminSetFood,
  showMessage,
  selectedAdminCategory,
  setSelectedAdminCategory,
  BACKEND_URL, // Receive BACKEND_URL prop
}) => {
  const [adminView, setAdminView] = useState('voting'); // 'voting' or 'report'

  return (
    <section className="max-w-3xl p-8 mx-auto mb-10 bg-white border border-teal-200 shadow-xl rounded-2xl">
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
                className={`px-4 py-2 rounded-lg shadow-md transition ${adminView === 'voting' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                จัดการโหวต
              </button>
              <button
                onClick={() => setAdminView('report')}
                className={`px-4 py-2 rounded-lg shadow-md transition ${adminView === 'report' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                รายงาน
              </button>
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

              {dailyMenu.status === 'voting' && (
                <DailyMenuControl
                  dailyMenuStatus={dailyMenu.status}
                  handleCloseVoting={handleCloseVoting}
                  adminDirectSelectFoodId={adminDirectSelectFoodId}
                  setAdminDirectSelectFoodId={setAdminDirectSelectFoodId}
                  handleAdminSetFood={handleAdminSetFood}
                  foodItems={foodItems}
                />
              )}

              {dailyMenu.status !== 'voting' && ( // Show direct set if not currently voting
                <DailyMenuControl
                  dailyMenuStatus={dailyMenu.status}
                  handleCloseVoting={handleCloseVoting}
                  adminDirectSelectFoodId={adminDirectSelectFoodId}
                  setAdminDirectSelectFoodId={setAdminDirectSelectFoodId}
                  handleAdminSetFood={handleAdminSetFood}
                  foodItems={foodItems}
                />
              )}
            </>
          )}

          {adminView === 'report' && (
            <GMReport BACKEND_URL={BACKEND_URL} showMessage={showMessage} />
          )}
        </>
      )}
    </section>
  );
};

export default AdminDashboard;