import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaCalendarCheck, FaTrophy, FaUsers, FaChartLine, FaThumbsDown, FaUserCheck, FaThumbsUp } from 'react-icons/fa';

// Reusable Stat Card Component
const StatCard = ({ icon, title, value, iconColor, isLoading }) => (
    <div className="p-5 md:p-6 rounded-2xl flex items-center space-x-4 bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className={`text-3xl md:text-4xl ${iconColor}`}>{icon}</div>
        <div>
            <p className="text-sm md:text-base font-semibold text-gray-600">{title}</p>
            {isLoading ? (
                <div className="h-8 w-24 bg-gray-300 animate-pulse rounded-md mt-1"></div>
            ) : (
                <p className="text-xl md:text-2xl font-bold text-gray-800 truncate">{value}</p>
            )}
        </div>
    </div>
);

// Custom Tooltip for Charts
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-4 bg-white bg-opacity-90 border border-gray-300 rounded-xl shadow-lg">
                <p className="font-bold text-teal-600 mb-2">{`${label}`}</p>
                {payload.map((pld, index) => (
                    <p key={index} className="text-gray-800" style={{ color: pld.color }}>
                        <span className="font-medium">{pld.name}:</span> {pld.value}
                    </p>
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

    // New states for current day's summary
    const [currentDaySummary, setCurrentDaySummary] = useState(null);
    const [currentDayLoading, setCurrentDayLoading] = useState(true);

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
    const [mostPopularFoods, setMostPopularFoods] = useState([]); // New state for most popular foods
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

    // useEffect to fetch summary for the selected date (for the detailed card)
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

    // New useEffect to fetch summary for the current day (for the stat cards)
    useEffect(() => {
        const fetchCurrentDaySummary = async () => {
            setCurrentDayLoading(true);
            const today = new Date().toISOString().split('T')[0];
            try {
                const response = await fetch(`${BACKEND_URL}/api/reports/daily-summary?date=${today}`);
                if (!response.ok) throw new Error('Failed to fetch current day summary');
                const data = await response.json();
                setCurrentDaySummary(data);
            } catch (err) {
                // setCurrentDayError(err.message); // Removed this line
            } finally {
                setCurrentDayLoading(false);
            }
        };
        fetchCurrentDaySummary();
    }, [BACKEND_URL]);

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
            const mostPopularPromise = fetch(`${BACKEND_URL}/api/reports/most-popular-foods?startDate=${chartStartDate}&endDate=${chartEndDate}&limit=5`).then(res => res.json()); // New promise
            const voterTurnoutPromise = fetch(`${BACKEND_URL}/api/reports/voter-turnout?startDate=${chartStartDate}&endDate=${chartEndDate}`).then(res => res.json());

            try {
                const [chartResult, leastPopularResult, voterTurnoutResult, mostPopularResult] = await Promise.all([chartPromise, leastPopularPromise, voterTurnoutPromise, mostPopularPromise]); // Add mostPopularResult
                setChartData(chartResult);
                setLeastPopularFoods(leastPopularResult);
                setMostPopularFoods(mostPopularResult); // Set most popular foods
                setVoterTurnoutData(voterTurnoutResult.map(d => ({...d, date: new Date(d.date).toLocaleDateString('en-GB')}))); // Format date for display
            } catch (err) {
                setDataError('Failed to load dashboard data');
                console.error(err);
            } finally {
                setDataLoading(false);
            }
        };
        fetchDashboardData();
    }, [BACKEND_URL, chartStartDate, chartEndDate]);

    const { dailyState: currentDailyState, dailyResult: currentDailyResult } = currentDaySummary || {};
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
            {/* Stat Cards Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <StatCard icon={<FaCalendarCheck />} title="ສະຖານະມື້ນີ້" value={getStatusText(currentDailyState)} iconColor="text-teal-500" isLoading={currentDayLoading} />
                <StatCard icon={<FaTrophy />} title="ຜູ້ຊະນະມື້ນີ້" value={currentDailyResult?.winning_food_name || '—'} iconColor="text-amber-500" isLoading={currentDayLoading} />
                <StatCard icon={<FaUsers />} title="ຄົນໂຫວດມື້ນີ້" value={currentDailyResult?.total_votes ?? '—'} iconColor="text-blue-500" isLoading={currentDayLoading} />
                <StatCard icon={<FaChartLine />} title="ເມນູຍອດນິຍົມ (ເດືອນນີ້)" value={overallSummary?.monthly?.winning_food_name || '—'} iconColor="text-purple-500" isLoading={overallLoading} />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                {/* Date Selection Card */}
                <div className="lg:col-span-1 bg-white p-5 md:p-6 rounded-2xl border border-gray-200 shadow-md space-y-4 self-start">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">ຂໍ້ມູນລະອຽດ</h3>
                    <div>
                        <label htmlFor="summary-date-picker" className="block text-gray-700 text-sm font-semibold mb-2">ເລືອກວັນທີ:</label>
                        <input 
                            type="date" 
                            id="summary-date-picker" 
                            value={selectedDate} 
                            onChange={(e) => setSelectedDate(e.target.value)} 
                            className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors" 
                        />
                    </div>
                    {loading && <div className="text-center py-4 text-gray-600">ກຳລັງໂຫຼດ...</div>}
                    {error && <div className="text-center py-4 text-red-500">ຂໍ້ຜິດພາດ: {error}</div>}
                    {!loading && !error && (
                        <div className="space-y-3">
                            <p className="flex justify-between">
                                <span className="font-medium text-gray-700">ວັນທີ:</span>
                                <span className="text-gray-600">{new Date(selectedDate).toLocaleDateString('en-GB')}</span>
                            </p>
                            <p className="flex justify-between">
                                <span className="font-medium text-gray-700">ສະຖານະ:</span>
                                <span className="font-bold text-teal-600">{getStatusText(dailyState)}</span>
                            </p>
                            <p className="flex justify-between">
                                <span className="font-medium text-gray-700">ອາຫານທີ່ຊະນະ:</span>
                                <span className="text-gray-600">{dailyResult?.winning_food_name || 'ບໍ່ມີ'}</span>
                            </p>
                            <p className="flex justify-between">
                                <span className="font-medium text-gray-700">ຈຳນວນໂຫວດ:</span>
                                <span className="text-gray-600">{dailyResult?.total_votes ?? 'ບໍ່ມີ'}</span>
                            </p>
                            {dailyResult?.vote_details?.length > 0 && (
                                <div className="pt-2 border-t border-gray-200">
                                    <p className="font-semibold text-gray-800 mb-2">ລາຍລະອຽດ:</p>
                                    <ul className="space-y-2">
                                        {dailyResult.vote_details.map((pack, index) => (
                                            <li key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                                <span className="text-gray-700">{pack.name}</span>
                                                <span className="font-bold text-teal-600">{pack.votes} ໂຫວດ</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Chart Section */}
                <div className="lg:col-span-2 bg-white p-5 md:p-6 rounded-2xl border border-gray-200 shadow-md">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <h3 className="text-xl font-bold text-gray-800">ສະຖິຕິການໂຫວດອາຫານ</h3>
                        <div className="flex flex-wrap gap-2">
                            <button 
                                onClick={() => handleSetDateRange('7days')} 
                                className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                7 ມື້
                            </button>
                            <button 
                                onClick={() => handleSetDateRange('thisMonth')} 
                                className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                ເດືອນນີ້
                            </button>
                            <button 
                                onClick={() => handleSetDateRange('lastMonth')} 
                                className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                ເດືອນກ່ອນ
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 mb-4">
                        <div className="flex-1">
                            <label htmlFor="chart-start-date" className="block text-gray-700 text-sm font-semibold mb-1">ວັນທີເລີ່ມຕົ້ນ:</label>
                            <input 
                                type="date" 
                                id="chart-start-date" 
                                value={chartStartDate} 
                                onChange={(e) => setChartStartDate(e.target.value)} 
                                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors" 
                            />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="chart-end-date" className="block text-gray-700 text-sm font-semibold mb-1">ວັນທີສິ້ນສຸດ:</label>
                            <input 
                                type="date" 
                                id="chart-end-date" 
                                value={chartEndDate} 
                                onChange={(e) => setChartEndDate(e.target.value)} 
                                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors" 
                            />
                        </div>
                    </div>
                    
                    <div className="h-80">
                        {dataLoading && <div className="text-center pt-16 text-gray-600">ກຳລັງໂຫຼດຂໍ້ມູນ...</div>}
                        {dataError && <div className="text-center pt-16 text-red-500">{dataError}</div>}
                        {!dataLoading && !dataError && chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 70 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis 
                                        dataKey="food_name" 
                                        angle={-45} 
                                        textAnchor="end" 
                                        height={80} 
                                        interval={0} 
                                        tick={{ fontSize: 12 }} 
                                    />
                                    <YAxis />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(75, 192, 192, 0.2)' }} />
                                    <Legend wrapperStyle={{ bottom: 0, left: 20 }} />
                                    <Bar 
                                        dataKey="total_votes" 
                                        fill="#0d9488" 
                                        name="ຈຳນວນໂຫວດ" 
                                        barSize={20} 
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                             !dataLoading && !dataError && <div className="text-center pt-16 text-gray-600">ບໍ່ພົບຂໍ້ມູນການໂຫວດສຳລັບຊ່ວງວັນທີນີ້.</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Section with Popular/Unpopular Foods and Voter Turnout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                {/* Least Popular Foods */}
                <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-200 shadow-md">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <FaThumbsDown className="mr-2 text-red-500" /> 5 ເມນູທີ່ບໍ່ໄດ້ຮັບຄວາມນິຍົມທີ່ສຸດ
                    </h3>
                    {dataLoading && <div className="text-center py-4 text-gray-600">ກຳລັງໂຫຼດ...</div>}
                    {!dataLoading && leastPopularFoods.length > 0 && (
                        <ul className="space-y-3">
                            {leastPopularFoods.map((food, index) => (
                                <li key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                    <span className="text-gray-700 font-medium">{food.food_name}</span>
                                    <span className="font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full">{food.total_votes} ໂຫວດ</span>
                                </li>
                            ))}
                        </ul>
                    )}
                    {!dataLoading && leastPopularFoods.length === 0 && (
                        <div className="text-center py-4 text-gray-600">ບໍ່ພົບຂໍ້ມູນ.</div>
                    )}
                </div>

                {/* Most Popular Foods */}
                <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-200 shadow-md">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <FaThumbsUp className="mr-2 text-green-500" /> 5 ເມນູໄດ້ຮັບຄວາມນິຍົມທີ່ສຸດ
                    </h3>
                    {dataLoading && <div className="text-center py-4 text-gray-600">ກຳລັງໂຫຼດ...</div>}
                    {!dataLoading && mostPopularFoods.length > 0 && (
                        <ul className="space-y-3">
                            {mostPopularFoods.map((food, index) => (
                                <li key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                    <span className="text-gray-700 font-medium">{food.food_name}</span>
                                    <span className="font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">{food.total_votes} ໂຫວດ</span>
                                </li>
                            ))}
                        </ul>
                    )}
                    {!dataLoading && mostPopularFoods.length === 0 && (
                        <div className="text-center py-4 text-gray-600">ບໍ່ພົບຂໍ້ມູນ.</div>
                    )}
                </div>

                {/* Voter Turnout Chart */}
                <div className="lg:col-span-2 bg-white p-5 md:p-6 rounded-2xl border border-gray-200 shadow-md">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <FaUserCheck className="mr-2 text-blue-500" /> ສະຖິຕິການມີສ່ວນຮ່ວມຂອງຜູ້ໃຊ້
                    </h3>
                    <div className="h-80">
                        {dataLoading && <div className="text-center pt-16 text-gray-600">ກຳລັງໂຫຼດຂໍ້ມູນ...</div>}
                        {dataError && <div className="text-center pt-16 text-red-500">{dataError}</div>}
                        {!dataLoading && !dataError && voterTurnoutData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={voterTurnoutData} margin={{ top: 5, right: 20, left: -10, bottom: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis 
                                        dataKey="date" 
                                        tick={{ fontSize: 12 }} 
                                    />
                                    <YAxis />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend wrapperStyle={{ bottom: -10, left: 20 }} />
                                    <Line 
                                        type="monotone" 
                                        dataKey="voter_count" 
                                        name="ຈຳນວນຜູ້ໂຫວດ" 
                                        stroke="#3b82f6" 
                                        strokeWidth={3} 
                                        dot={{ r: 5, fill: '#3b82f6' }}
                                        activeDot={{ r: 8, fill: '#2563eb' }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            !dataLoading && !dataError && <div className="text-center pt-16 text-gray-600">ບໍ່ພົບຂໍ້ມູນ.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DailySummary;