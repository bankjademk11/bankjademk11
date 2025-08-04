import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DailySummary = ({ BACKEND_URL }) => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    const [chartStartDate, setChartStartDate] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() - 7); // Default to 7 days ago
        return d.toISOString().split('T')[0];
    });
    const [chartEndDate, setChartEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [chartData, setChartData] = useState([]);
    const [chartLoading, setChartLoading] = useState(true);
    const [chartError, setChartError] = useState(null);

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

    useEffect(() => {
        const fetchChartData = async () => {
            setChartLoading(true);
            setChartError(null);
            try {
                const response = await fetch(`${BACKEND_URL}/api/reports/daily-food-votes?startDate=${chartStartDate}&endDate=${chartEndDate}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch chart data');
                }
                const data = await response.json();
                setChartData(data);
            } catch (err) {
                setChartError(err.message);
            } finally {
                setChartLoading(false);
            }
        };

        if (chartStartDate && chartEndDate) {
            fetchChartData();
        }
    }, [BACKEND_URL, chartStartDate, chartEndDate]);

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

            <h3 className="text-2xl font-bold mt-8 mb-4 text-primary">ສະຖິຕິການໂຫວດອາຫານ</h3>
            <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex-1 min-w-[200px]">
                    <label htmlFor="chart-start-date" className="block text-secondary text-sm font-semibold mb-1">ວັນທີເລີ່ມຕົ້ນ:</label>
                    <input
                        type="date"
                        id="chart-start-date"
                        value={chartStartDate}
                        onChange={(e) => setChartStartDate(e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-transparent transition-colors"
                    />
                </div>
                <div className="flex-1 min-w-[200px]">
                    <label htmlFor="chart-end-date" className="block text-secondary text-sm font-semibold mb-1">ວັນທີສິ້ນສຸດ:</label>
                    <input
                        type="date"
                        id="chart-end-date"
                        value={chartEndDate}
                        onChange={(e) => setChartEndDate(e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-transparent transition-colors"
                    />
                </div>
            </div>

            {chartLoading && <div className="text-center py-4 text-secondary">ກຳລັງໂຫຼດຂໍ້ມູນກຣາຟ...</div>}
            {chartError && <div className="text-center py-4 text-red-500">ຂໍ້ຜິດພາດໃນການໂຫຼດຂໍ້ມູນກຣາຟ: {chartError}</div>}

            {!chartLoading && !chartError && chartData.length > 0 ? (
                <div className="bg-background p-6 rounded-lg shadow-md h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="food_name" angle={-45} textAnchor="end" height={80} interval={0} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="total_votes" fill="#388E3C" name="ຈຳນວນໂຫວດ" barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                !chartLoading && !chartError && <div className="text-center py-4 text-secondary">ບໍ່ພົບຂໍ້ມູນການໂຫວດສຳລັບຊ່ວງວັນທີນີ້.</div>
            )}
        </div>
    );
};

export default DailySummary;