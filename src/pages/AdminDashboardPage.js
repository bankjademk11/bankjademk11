import React from 'react';
import DailySummary from '../components/admin/DailySummary';

const AdminDashboardPage = ({ BACKEND_URL }) => {
    return (
        <div>
            <DailySummary BACKEND_URL={BACKEND_URL} />
        </div>
    );
};

export default AdminDashboardPage;