import React, { useState, useEffect } from 'react';

const Dashboard = () => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const response = await fetch('/api/reports/summary');
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
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold">Most Popular (Monthly)</h2>
                    <p>{summary?.monthly?.winning_food_name || 'N/A'}</p>
                    <p>Wins: {summary?.monthly?.wins || 0}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold">Most Popular (Yearly)</h2>
                    <p>{summary?.yearly?.winning_food_name || 'N/A'}</p>
                    <p>Wins: {summary?.yearly?.wins || 0}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold">Most Popular (Overall)</h2>
                    <p>{summary?.overall?.winning_food_name || 'N/A'}</p>
                    <p>Wins: {summary?.overall?.wins || 0}</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;