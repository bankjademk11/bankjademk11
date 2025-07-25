import React, { useState, useEffect } from 'react';

const DailySummary = ({ BACKEND_URL }) => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        const fetchDailySummary = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${BACKEND_URL}/api/reports/daily-summary?date=${selectedDate}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch daily summary');
                }
                const data = await response.json();
                setSummary(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDailySummary();
    }, [BACKEND_URL, selectedDate]);

    if (loading) return <div className="text-center py-4">Loading daily summary...</div>;
    if (error) return <div className="text-center py-4 text-red-500">Error: {error}</div>;

    const { dailyState, dailyResult } = summary;

    return (
        <div className="p-4 bg-gray-50 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-teal-700">Daily Activity Summary</h2>

            <div className="mb-4">
                <label htmlFor="summary-date-picker" className="block text-gray-700 text-sm font-bold mb-2">Select Date:</label>
                <input
                    type="date"
                    id="summary-date-picker"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2">Daily Menu State</h3>
                    {dailyState ? (
                        <>
                            <p><strong>Date:</strong> {dailyState.date}</p>
                            <p><strong>Status:</strong> <span className={`font-bold ${dailyState.status === 'voting' ? 'text-blue-600' : dailyState.status === 'closed' ? 'text-red-600' : 'text-gray-600'}`}>{dailyState.status}</span></p>
                            {dailyState.winning_food_item_id && <p><strong>Winning Food ID:</strong> {dailyState.winning_food_item_id}</p>}
                            {dailyState.admin_set_food_item_id && <p><strong>Admin Set Food ID:</strong> {dailyState.admin_set_food_item_id}</p>}
                            {dailyState.vote_options && dailyState.vote_options.length > 0 && (
                                <div className="mt-2">
                                    <p className="font-medium">Vote Options:</p>
                                    <ul className="list-disc list-inside ml-4">
                                        {dailyState.vote_options.map((option, index) => (
                                            <li key={index}>{option.name} (Votes: {option.votes})</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {dailyState.voted_users && Object.keys(dailyState.voted_users).length > 0 && (
                                <div className="mt-2">
                                    <p className="font-medium">Voted Users:</p>
                                    <ul className="list-disc list-inside ml-4">
                                        {Object.keys(dailyState.voted_users).map((userId, index) => (
                                            <li key={index}>{userId} voted for {dailyState.voted_users[userId]}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </>
                    ) : (
                        <p>No daily menu state found for this date.</p>
                    )}
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2">Daily Voting Result</h3>
                    {dailyResult ? (
                        <>
                            <p><strong>Date:</strong> {dailyResult.date}</p>
                            <p><strong>Winning Food:</strong> {dailyResult.winning_food_name || 'N/A'}</p>
                            <p><strong>Total Votes:</strong> {dailyResult.total_votes}</p>
                            {dailyResult.vote_details && Object.keys(dailyResult.vote_details).length > 0 && (
                                <div className="mt-2">
                                    <p className="font-medium">Vote Details (Food ID: Votes):</p>
                                    <ul className="list-disc list-inside ml-4">
                                        {Object.keys(dailyResult.vote_details).map((foodId, index) => (
                                            <li key={index}>Food ID {foodId}: {dailyResult.vote_details[foodId]} votes</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </>
                    ) : (
                        <p>No daily voting result found for this date.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DailySummary;