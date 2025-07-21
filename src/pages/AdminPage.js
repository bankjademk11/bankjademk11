import React from 'react';
import {
  AdminDashboard,
} from '../components';

const AdminPage = ({
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
  BACKEND_URL,
}) => {
  return (
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
      dailyMenu={dailyMenu}
      handleCloseVoting={handleCloseVoting}
      adminDirectSelectFoodId={adminDirectSelectFoodId}
      setAdminDirectSelectFoodId={setAdminDirectSelectFoodId}
      handleAdminSetFood={handleAdminSetFood}
      showMessage={showMessage}
      selectedAdminCategory={selectedAdminCategory}
      setSelectedAdminCategory={setSelectedAdminCategory}
      BACKEND_URL={BACKEND_URL}
    />
  );
};

export default AdminPage;