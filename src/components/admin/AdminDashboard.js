import React from 'react';
import AdminLogin from './AdminLogin';
import VoteSelection from './VoteSelection';
import DailyMenuControl from './DailyMenuControl';

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
}) => {
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
          <div className="text-right mb-4">
            <button
              onClick={handleAdminLogout}
              className="px-4 py-2 text-sm font-bold text-white transition duration-300 bg-red-500 rounded-lg hover:bg-red-600"
            >
              ออกจากระบบ
            </button>
          </div>

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
    </section>
  );
};

export default AdminDashboard;