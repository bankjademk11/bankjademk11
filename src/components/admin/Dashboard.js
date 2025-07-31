import React, { useState, useEffect } from 'react';

const Dashboard = ({ BACKEND_URL }) => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/api/reports/summary`);
                if (!response.ok) {
                    throw new Error('Failed to fetch summary');
                }
                const data = await response.json();
                setSummary(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, [BACKEND_URL]);

    if (loading) return <div className="text-center py-4 text-secondary">ກຳລັງໂຫຼດ...</div>;
    if (error) return <div className="text-center py-4 text-red-500">ຂໍ້ຜິດພາດ: {error}</div>;

    return (
        <div className="p-6 bg-surface rounded-2xl shadow-lg">
            <h1 className="text-3xl font-bold mb-6 text-center text-primary">ພາບລວມ Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-background p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-2 text-primary">ຍອດນິຍົມ (ລາຍເດືອນ)</h2>
                    <p className="text-lg font-medium text-secondary">{summary?.monthly?.winning_food_name || 'ບໍ່ມີ'}</p>
                    <p className="text-sm text-gray-500">ຊະນະ: <span className="font-semibold text-primary">{summary?.monthly?.wins || 0}</span> ຄັ້ງ</p>
                </div>
                <div className="bg-background p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-2 text-primary">ຍອດນິຍົມ (ລາຍປີ)</h2>
                    <p className="text-lg font-medium text-secondary">{summary?.yearly?.winning_food_name || 'ບໍ່ມີ'}</p>
                    <p className="text-sm text-gray-500">ຊະນະ: <span className="font-semibold text-primary">{summary?.yearly?.wins || 0}</span> ຄັ້ງ</p>
                </div>
                <div className="bg-background p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-2 text-primary">ຍອດນິຍົມ (ທັງໝົດ)</h2>
                    <p className="text-lg font-medium text-secondary">{summary?.overall?.winning_food_name || 'ບໍ່ມີ'}</p>
                    <p className="text-sm text-gray-500">ຊະນະ: <span className="font-semibold text-primary">{summary?.overall?.wins || 0}</span> ຄັ້ງ</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;