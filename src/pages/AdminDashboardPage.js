import React from 'react';
import DailySummary from '../components/admin/DailySummary';

const AdminDashboardPage = ({ BACKEND_URL }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800">ຜູ້ດູແລລະບົບ (Admin Panel)</h1>
                    <p className="text-gray-600 mt-2">ພາບລວມຂໍ້ມູນລະບົບ</p>
                </div>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <DailySummary BACKEND_URL={BACKEND_URL} />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;