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
  setFoodItems,
  adminVoteSelections,
  setAdminVoteSelections,
  toggleAdminVoteSelection,
  showMessage,
  selectedAdminCategory,
  setSelectedAdminCategory,
  BACKEND_URL,
}) => {
  return (
    <div className="min-h-screen bg-background py-10">
      <AdminDashboard
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
        selectedAdminCategory={selectedAdminCategory}
        setSelectedAdminCategory={setSelectedAdminCategory}
        BACKEND_URL={BACKEND_URL}
      />
    </div>
  );
};

export default AdminPage;