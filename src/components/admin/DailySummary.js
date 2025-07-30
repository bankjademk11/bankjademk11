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

    if (loading) return <div className="text-center py-4">ກຳລັງໂຫຼດສະຫຼຸບປະຈຳວັນ...</div>;
    if (error) return <div className="text-center py-4 text-red-500">ຂໍ້ຜິດພາດ: {error}</div>;

    const { dailyState, dailyResult } = summary;

    return (
        <div className="max-w-6xl xl:max-w-screen-xl mx-auto p-4 bg-gray-50 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-teal-700">ສະຫຼຸບກິດຈະກຳປະຈຳວັນ</h2>

            <div className="mb-4">
                <label htmlFor="summary-date-picker" className="block text-gray-700 text-sm font-bold mb-2">ເລືອກວັນທີ:</label>
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
                    <h3 className="text-lg font-semibold mb-2">ສະຖານະເມນູປະຈຳວັນ</h3>
                    {dailyState ? (
                        <>
                            <p><strong>ວັນທີ:</strong> {dailyState.date}</p>
                            <p><strong>ສະຖານະ:</strong> <span className={`font-bold ${dailyState.status === 'voting' ? 'text-blue-600' : dailyState.status === 'closed' ? 'text-red-600' : 'text-gray-600'}`}>{dailyState.status === 'idle' ? 'ບໍ່ມີກິດຈະກຳ' : dailyState.status === 'voting' ? 'ກຳລັງໂຫວດ' : dailyState.status === 'closed' ? 'ປິດໂຫວດແລ້ວ' : dailyState.status === 'admin_set' ? 'ແອັດມິນກຳນົດ' : dailyState.status}</span></p>
                            {dailyState.winning_food_item_id && <p><strong>ID ອາຫານທີ່ຊະນະ:</strong> {dailyState.winning_food_item_id}</p>}
                            {dailyState.admin_set_food_item_id && <p><strong>ID ອາຫານທີ່ແອັດມິນກຳນົດ:</strong> {dailyState.admin_set_food_item_id}</p>}
                            {dailyState.vote_options && dailyState.vote_options.length > 0 && (
                                <div className="mt-2">
                                    <p className="font-medium">ຕົວເລືອກການໂຫວດ:</p>
                                    <ul className="list-disc list-inside ml-4">
                                        {dailyState.vote_options.map((option, index) => (
                                            <li key={index}>{option.name} (ໂຫວດ: {option.votes})</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {dailyState.voted_users && Object.keys(dailyState.voted_users).length > 0 && (
                                <div className="mt-2">
                                    <p className="font-medium">ຜູ້ໃຊ້ທີ່ໂຫວດແລ້ວ:</p>
                                    <ul className="list-disc list-inside ml-4">
                                        {Object.keys(dailyState.voted_users).map((userId, index) => (
                                            <li key={index}>ຜູ້ໃຊ້ {userId} ໂຫວດໃຫ້ {dailyState.voted_users[userId]}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </>
                    ) : (
                        <p>ບໍ່ພົບສະຖານະເມນູປະຈຳວັນສຳລັບວັນທີນີ້.</p>
                    )}
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-2">ຜົນການໂຫວດປະຈຳວັນ</h3>
                    {dailyResult ? (
                        <>
                            <p><strong>ວັນທີ:</strong> {dailyResult.date}</p>
                            <p><strong>ອາຫານທີ່ຊະນະ:</strong> {typeof dailyResult.winning_food_name === 'object' && dailyResult.winning_food_name !== null ? dailyResult.winning_food_name.name : dailyResult.winning_food_name || 'ບໍ່ມີ'}</p>
                            <p><strong>ຈຳນວນໂຫວດທັງໝົດ:</strong> {dailyResult.total_votes}</p>
                            {dailyResult.vote_details && Array.isArray(dailyResult.vote_details) ? (
                                <div className="mt-2">
                                    <p className="font-medium">ລາຍລະອຽດການໂຫວດ:</p>
                                    <ul className="list-disc list-inside ml-4">
                                        {dailyResult.vote_details.map((pack, index) => (
                                            <li key={index}>{pack.name}: {pack.votes} ໂຫວດ</li>
                                        ))}
                                    </ul>
                                </div>
                            ) : dailyResult.vote_details && typeof dailyResult.vote_details === 'object' && Object.keys(dailyResult.vote_details).length > 0 ? (
                                <div className="mt-2">
                                    <p className="font-medium">ລາຍລະອຽດການໂຫວດ (ID ອາຫານ: ໂຫວດ):</p>
                                    <ul className="list-disc list-inside ml-4">
                                        {Object.entries(dailyResult.vote_details).map(([foodId, votes]) => (
                                            <li key={foodId}>ID ອາຫານ {foodId}: {votes} ໂຫວດ</li>
                                        ))}
                                    </ul>
                                </div>
                            ) : null}
                        </>
                    ) : (
                        <p>ບໍ່ພົບຜົນການໂຫວດປະຈຳວັນສຳລັບວັນທີນີ້.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DailySummary;