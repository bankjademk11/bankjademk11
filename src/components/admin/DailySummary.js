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

    if (loading) return <div className="text-center py-4 text-secondary">ກຳລັງໂຫຼດສະຫຼຸບປະຈຳວັນ...</div>;
    if (error) return <div className="text-center py-4 text-red-500">ຂໍ້ຜິດພາດ: {error}</div>;

    const { dailyState, dailyResult } = summary;

    return (
        <div className="p-6 bg-surface rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-center text-primary">ສະຫຼຸບກິດຈະກຳປະຈຳວັນ</h2>

            <div className="mb-6">
                <label htmlFor="summary-date-picker" className="block text-secondary text-lg font-semibold mb-2">ເລືອກວັນທີ:</label>
                <input
                    type="date"
                    id="summary-date-picker"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="block w-full px-4 py-3 mt-1 text-lg border border-gray-300 shadow-sm rounded-lg focus:ring-primary focus:border-transparent transition-colors"
                />
            </div>

            <div className="bg-background p-6 rounded-lg shadow-md">
                {dailyState || dailyResult ? (
                    <>
                        <p className="mb-2"><strong className="text-primary">ວັນທີ:</strong> <span className="text-secondary">{selectedDate}</span></p>
                        {dailyState && (
                            <p className="mb-2"><strong className="text-primary">ສະຖານະເມນູ:</strong> <span className={`font-bold ${dailyState.status === 'voting' ? 'text-blue-600' : dailyState.status === 'closed' ? 'text-red-600' : dailyState.status === 'admin_set' ? 'text-green-600' : 'text-secondary'}`}>{dailyState.status === 'idle' ? 'ບໍ່ມີກິດຈະກຳ' : dailyState.status === 'voting' ? 'ກຳລັງໂຫວດ' : dailyState.status === 'closed' ? 'ປິດໂຫວດແລ້ວ' : dailyState.status === 'admin_set' ? 'ແອັດມິນກຳນົດ' : dailyState.status}</span></p>
                        )}

                        {dailyResult ? (
                            <>
                                <p className="mb-2"><strong className="text-primary">ອາຫານທີ່ຊະນະ:</strong> <span className="text-secondary">{typeof dailyResult.winning_food_name === 'object' && dailyResult.winning_food_name !== null ? dailyResult.winning_food_name.name : dailyResult.winning_food_name || 'ບໍ່ມີ'}</span></p>
                                <p className="mb-2"><strong className="text-primary">ຈຳນວນໂຫວດທັງໝົດ:</strong> <span className="text-secondary">{dailyResult.total_votes}</span></p>
                                {dailyResult.vote_details && Array.isArray(dailyResult.vote_details) && dailyResult.vote_details.length > 0 && (
                                    <div className="mt-4">
                                        <p className="font-semibold text-primary mb-2">ລາຍລະອຽດການໂຫວດ:</p>
                                        <ul className="list-disc list-inside ml-4 text-secondary">
                                            {dailyResult.vote_details.map((pack, index) => (
                                                <li key={index}>{pack.name}: {pack.votes} ໂຫວດ</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </>
                        ) : (
                            <p className="text-secondary">ບໍ່ພົບຜົນການໂຫວດປະຈຳວັນສຳລັບວັນທີນີ້.</p>
                        )}

                        {!dailyState && !dailyResult && (
                            <p className="text-secondary">ບໍ່ພົບຂໍ້ມູນສະຫຼຸບປະຈຳວັນສຳລັບວັນທີນີ້.</p>
                        )}
                    </>
                ) : (
                    <p className="text-secondary">ບໍ່ພົບຂໍ້ມູນສະຫຼຸບປະຈຳວັນສຳລັບວັນທີນີ້.</p>
                )}
            </div>
        </div>
    );
};

export default DailySummary;