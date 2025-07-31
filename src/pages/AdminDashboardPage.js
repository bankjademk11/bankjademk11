import React from 'react';
import DailySummary from '../components/admin/DailySummary';

const AdminDashboardPage = ({ BACKEND_URL }) => {
    return (
        <div className="min-h-screen bg-background py-10">
            <DailySummary BACKEND_URL={BACKEND_URL} />
        </div>
    );
};

export default AdminDashboardPage;