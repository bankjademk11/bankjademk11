import React from 'react';
import Dashboard from '../components/admin/Dashboard';

const AdminDashboardPage = ({ BACKEND_URL }) => {
    return (
        <div>
            <Dashboard BACKEND_URL={BACKEND_URL} />
        </div>
    );
};

export default AdminDashboardPage;