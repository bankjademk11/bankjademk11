import React from 'react';
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminLogin from '../components/admin/AdminLogin';

const AdminPage = ({
  isAdmin,
  adminName,
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
  // If user is not admin, show the full-screen login page
  if (!isAdmin) {
    return (
      <AdminLogin
        handleAdminLogin={handleAdminLogin}
      />
    );
  }

  // If user is admin, show the dashboard
  return (
    <AdminDashboard
      isAdmin={isAdmin}
      adminName={adminName}
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
  );
};

export default AdminPage;