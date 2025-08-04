import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaCalendarCheck, FaTrophy, FaUsers, FaChartLine, FaThumbsDown, FaUserCheck } from 'react-icons/fa';

// Reusable Stat Card Component
const StatCard = ({ icon, title, value, bgColor, isLoading }) => (
    <div className={`p-4 md:p-6 rounded-2xl flex items-center space-x-4 ${bgColor}`}>
        <div className="text-3xl md:text-4xl">{icon}</div>
        <div>
            <p className="text-sm md:text-base font-semibold">{title}</p>
            {isLoading ? (
                <div className="h-8 w-24 bg-gray-400 animate-pulse rounded-md"></div>
            ) : (
                <p className="text-xl md:text-2xl font-bold truncate">{value}</p>
            )}
        </div>
    </div>
);

// Custom Tooltip for Charts
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-3 bg-white border border-gray-300 rounded-lg">
                <p className="font-bold text-primary">{`${label}`}</p>
                {payload.map((pld, index) => (
                    <p key={index} style={{ color: pld.color }}>{`${pld.name}: ${pld.value}`}</p>
                ))}
            </div>
        );
    }
    return null;
};

const DailySummary = ({ BACKEND_URL }) => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    const [overallSummary, setOverallSummary] = useState(null);
    const [overallLoading, setOverallLoading] = useState(true);

    const [chartStartDate, setChartStartDate] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() - 6);
        return d.toISOString().split('T')[0];
    });
    const [chartEndDate, setChartEndDate] = useState(new Date().toISOString().split('T')[0]);
    
    const [chartData, setChartData] = useState([]);
    const [leastPopularFoods, setLeastPopularFoods] = useState([]);
    const [voterTurnoutData, setVoterTurnoutData] = useState([]);
    
    const [dataLoading, setDataLoading] = useState(true);
    const [dataError, setDataError] = useState(null);

    const handleSetDateRange = (preset) => {
        const today = new Date();
        let start, end = new Date();
        switch (preset) {
            case '7days':
                start = new Date();
                start.setDate(today.getDate() - 6);
                break;
            case 'thisMonth':
                start = new Date(today.getFullYear(), today.getMonth(), 1);
                break;
            case 'lastMonth':
                start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                end = new Date(today.getFullYear(), today.getMonth(), 0);
                break;
            default: return;
        }
        setChartStartDate(start.toISOString().split('T')[0]);
        setChartEndDate(end.toISOString().split('T')[0]);
    };

    useEffect(() => {
        const fetchDailySummary = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${BACKEND_URL}/api/reports/daily-summary?date=${selectedDate}`);
                if (!response.ok) throw new Error('Failed to fetch daily summary');
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
        const fetchOverallSummary = async () => {
            setOverallLoading(true);
            try {
                const response = await fetch(`${BACKEND_URL}/api/reports/summary`);
                if (!response.ok) throw new Error('Failed to fetch overall summary');
                const data = await response.json();
                setOverallSummary(data);
            } catch (err) {
                console.error("Failed to fetch overall summary:", err);
            } finally {
                setOverallLoading(false);
            }
        };
        fetchOverallSummary();
    }, [BACKEND_URL]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!chartStartDate || !chartEndDate) return;
            setDataLoading(true);
            setDataError(null);

            const chartPromise = fetch(`${BACKEND_URL}/api/reports/daily-food-votes?startDate=${chartStartDate}&endDate=${chartEndDate}`).then(res => res.json());
            const leastPopularPromise = fetch(`${BACKEND_URL}/api/reports/least-popular-foods?startDate=${chartStartDate}&endDate=${chartEndDate}&limit=5`).then(res => res.json());
            const voterTurnoutPromise = fetch(`${BACKEND_URL}/api/reports/voter-turnout?startDate=${chartStartDate}&endDate=${chartEndDate}`).then(res => res.json());

            try {
                const [chartResult, leastPopularResult, voterTurnoutResult] = await Promise.all([chartPromise, leastPopularPromise, voterTurnoutPromise]);
                setChartData(chartResult);
                setLeastPopularFoods(leastPopularResult);
                setVoterTurnoutData(voterTurnoutResult.map(d => ({...d, date: new Date(d.date).toLocaleDateString('en-CA')}))); // Format date for display
            } catch (err) {
                setDataError('Failed to load dashboard data');
                console.error(err);
            } finally {
                setDataLoading(false);
            }
        };
        fetchDashboardData();
    }, [BACKEND_URL, chartStartDate, chartEndDate]);

    const { dailyState, dailyResult } = summary || {};

    const getStatusText = (state) => {
        if (!state) return "ບໍ່ມີຂໍ້ມູນ";
        if (!state.is_visible) return "ປິດໃຊ້ງານ";
        switch (state.status) {
            case 'idle': return 'ບໍ່ມີກິດຈະກຳ';
            case 'voting': return 'ກຳລັງໂຫວດ';
            case 'closed': return 'ປິດໂຫວດແລ້ວ';
            case 'admin_set': return 'ແອັດມິນກຳນົດ';
            default: return state.status;
        }
    };

    return (
        <div className="p-4 md:p-6 space-y-6 md:space-y-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-primary">ພາບລວມ Dashboard</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <StatCard icon={<FaCalendarCheck />} title="ສະຖານະມື້ນີ້" value={getStatusText(dailyState)} bgColor="bg-blue-100 text-blue-800" isLoading={loading} />
                <StatCard icon={<FaTrophy />} title="ຜູ້ຊະນະມື້ນີ້" value={dailyResult?.winning_food_name || '—'} bgColor="bg-yellow-100 text-yellow-800" isLoading={loading} />
                <StatCard icon={<FaUsers />} title="ຄົນໂຫວດມື້ນີ້" value={dailyResult?.total_votes ?? '—'} bgColor="bg-green-100 text-green-800" isLoading={loading} />
                <StatCard icon={<FaChartLine />} title="ເມນູຍອດນິຍົມ (ເດືອນນີ້)" value={overallSummary?.monthly?.winning_food_name || '—'} bgColor="bg-purple-100 text-purple-800" isLoading={overallLoading} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                <div className="lg:col-span-1 bg-surface p-4 md:p-6 rounded-2xl border border-gray-200 space-y-4 self-start">
                    <h3 className="text-xl font-bold text-primary">ສະຫຼຸບປະຈຳວັນ</h3>
                    <div>
                        <label htmlFor="summary-date-picker" className="block text-secondary text-sm font-semibold mb-2">ເລືອກວັນທີ:</label>
                        <input type="date" id="summary-date-picker" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-transparent transition-colors" />
                    </div>
                    {loading && <div className="text-center py-4 text-secondary">ກຳລັງໂຫຼດ...</div>}
                    {error && <div className="text-center py-4 text-red-500">ຂໍ້ຜິດພາດ: {error}</div>}
                    {!loading && !error && (
                        <div className="space-y-2">
                            <p><strong className="text-primary">ວັນທີ:</strong> <span className="text-secondary">{selectedDate}</span></p>
                            <p><strong className="text-primary">ສະຖານະ:</strong> <span className="font-bold">{getStatusText(dailyState)}</span></p>
                            <p><strong className="text-primary">ອາຫານທີ່ຊະນະ:</strong> <span className="text-secondary">{dailyResult?.winning_food_name || 'ບໍ່ມີ'}</span></p>
                            <p><strong className="text-primary">ຈຳນວນໂຫວດ:</strong> <span className="text-secondary">{dailyResult?.total_votes ?? 'ບໍ່ມີ'}</span></p>
                            {dailyResult?.vote_details?.length > 0 && (
                                <div className="pt-2">
                                    <p className="font-semibold text-primary mb-1">ລາຍລະອຽດ:</p>
                                    <ul className="list-disc list-inside ml-4 text-secondary text-sm">
                                        {dailyResult.vote_details.map((pack, index) => <li key={index}>{pack.name}: {pack.votes} ໂຫວດ</li>)}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="lg:col-span-2 bg-surface p-4 md:p-6 rounded-2xl border border-gray-200">
                    <h3 className="text-xl font-bold text-primary mb-4">ສະຖິຕິການໂຫວດອາຫານ</h3>
                    <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-4">
                        <div className="flex-grow flex flex-col sm:flex-row gap-2 md:gap-4">
                            <div className="flex-1 min-w-[150px]">
                                <label htmlFor="chart-start-date" className="block text-secondary text-sm font-semibold mb-1">ວັນທີເລີ່ມຕົ້ນ:</label>
                                <input type="date" id="chart-start-date" value={chartStartDate} onChange={(e) => setChartStartDate(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-transparent transition-colors" />
                            </div>
                            <div className="flex-1 min-w-[150px]">
                                <label htmlFor="chart-end-date" className="block text-secondary text-sm font-semibold mb-1">ວັນທີສິ້ນສຸດ:</label>
                                <input type="date" id="chart-end-date" value={chartEndDate} onChange={(e) => setChartEndDate(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-transparent transition-colors" />
                            </div>
                        </div>
                        <div className="flex items-end gap-2 pt-5">
                            <button onClick={() => handleSetDateRange('7days')} className="px-3 py-2 text-sm bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">7 ມື້</button>
                            <button onClick={() => handleSetDateRange('thisMonth')} className="px-3 py-2 text-sm bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">ເດືອນນີ້</button>
                            <button onClick={() => handleSetDateRange('lastMonth')} className="px-3 py-2 text-sm bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">ເດືອນກ່ອນ</button>
                        </div>
                    </div>
                    <div className="h-80">
                        {dataLoading && <div className="text-center pt-16 text-secondary">ກຳລັງໂຫຼດຂໍ້ມູນ...</div>}
                        {dataError && <div className="text-center pt-16 text-red-500">{dataError}</div>}
                        {!dataLoading && !dataError && chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 70 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="food_name" angle={-45} textAnchor="end" height={80} interval={0} tick={{ fontSize: 12 }} />
                                    <YAxis />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(75, 192, 192, 0.2)' }} />
                                    <Legend wrapperStyle={{ bottom: 0, left: 20 }} />
                                    <Bar dataKey="total_votes" fill="#4CAF50" name="ຈຳນວນໂຫວດ" barSize={20} cursor="pointer" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                             !dataLoading && !dataError && <div className="text-center pt-16 text-secondary">ບໍ່ພົບຂໍ້ມູນການໂຫວດສຳລັບຊ່ວງວັນທີນີ້.</div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                <div className="bg-surface p-4 md:p-6 rounded-2xl border border-gray-200">
                    <h3 className="text-xl font-bold text-primary mb-4 flex items-center"><FaThumbsDown className="mr-2 text-red-500" /> 5 ເມນູທີ່ບໍ່ໄດ້ຮັບຄວາມນິຍົມທີ່ສຸດ</h3>
                    {dataLoading && <div className="text-center py-4 text-secondary">ກຳລັງໂຫຼດ...</div>}
                    {!dataLoading && leastPopularFoods.length > 0 && (
                        <ul className="space-y-2">
                            {leastPopularFoods.map((food, index) => (
                                <li key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <span className="text-secondary font-medium">{food.food_name}</span>
                                    <span className="font-bold text-red-600">{food.total_votes} ໂຫວດ</span>
                                </li>
                            ))}
                        </ul>
                    )}
                    {!dataLoading && leastPopularFoods.length === 0 && (
                        <div className="text-center py-4 text-secondary">ບໍ່ພົບຂໍ້ມູນ.</div>
                    )}
                </div>

                <div className="bg-surface p-4 md:p-6 rounded-2xl border border-gray-200">
                    <h3 className="text-xl font-bold text-primary mb-4 flex items-center"><FaUserCheck className="mr-2 text-blue-500" /> ສະຖິຕິການມີສ່ວນຮ່ວມຂອງຜູ້ໃຊ້</h3>
                    <div className="h-60">
                        {dataLoading && <div className="text-center pt-16 text-secondary">ກຳລັງໂຫຼດຂໍ້ມູນ...</div>}
                        {dataError && <div className="text-center pt-16 text-red-500">{dataError}</div>}
                        {!dataLoading && !dataError && voterTurnoutData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={voterTurnoutData} margin={{ top: 5, right: 20, left: -10, bottom: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                    <YAxis />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend wrapperStyle={{ bottom: -10, left: 20 }} />
                                    <Line type="monotone" dataKey="voter_count" name="ຈຳນວນຜູ້ໂຫວດ" stroke="#3B82F6" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            !dataLoading && !dataError && <div className="text-center pt-16 text-secondary">ບໍ່ພົບຂໍ້ມູນ.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DailySummary;