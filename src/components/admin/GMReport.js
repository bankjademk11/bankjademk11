import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GMReport = ({ BACKEND_URL, showMessage }) => {
  const [reports, setReports] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const navigate = useNavigate();

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i); // Last 5 years
  const months = [
    { value: '01', label: 'ມັງກອນ' },
    { value: '02', label: 'ກຸມພາ' },
    { value: '03', label: 'ມີນາ' },
    { value: '04', label: 'ເມສາ' },
    { value: '05', label: 'ພຶດສະພາ' },
    { value: '06', label: 'ມິຖຸນາ' },
    { value: '07', label: 'ກໍລະກົດ' },
    { value: '08', label: 'ສິງຫາ' },
    { value: '09', label: 'ກັນຍາ' },
    { value: '10', label: 'ຕຸລາ' },
    { value: '11', label: 'ພະຈິກ' },
    { value: '12', label: 'ທັນວາ' },
  ];

  useEffect(() => {
    const fetchReports = async () => {
      if (!BACKEND_URL) return;

      let url = `${BACKEND_URL}/api/reports/daily`;
      const params = new URLSearchParams();

      if (selectedMonth) {
        params.append('month', selectedMonth);
      }
      if (selectedYear) {
        params.append('year', selectedYear);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setReports(data);
      } catch (error) {
        console.error("Error fetching reports:", error);
        showMessage('ບໍ່ສາມາດໂຫຼດລາຍງານໄດ້', 'error');
      }
    };

    fetchReports();
  }, [BACKEND_URL, selectedMonth, selectedYear, showMessage]);

  return (
    <div className="p-6 bg-gray-100 bg-opacity-90 rounded-2xl shadow-lg">
      <h3 className="text-3xl font-bold text-center text-primary mb-6">ລາຍງານຜົນໂຫວດປະຈຳວັນ</h3>

      <div className="flex flex-wrap justify-center gap-6 mb-8">
        <div>
          <label htmlFor="month-select" className="block text-secondary text-lg font-semibold mb-2">ເລືອກເດືອນ:</label>
          <select
            id="month-select"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="block w-full px-4 py-3 text-lg border border-gray-300 shadow-sm rounded-lg focus:ring-primary focus:border-transparent transition-colors"
          >
            <option value="">ທັງໝົດ</option>
            {months.map(month => (
              <option key={month.value} value={month.value}>{month.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="year-select" className="block text-secondary text-lg font-semibold mb-2">ເລືອກປີ:</label>
          <select
            id="year-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="block w-full px-4 py-3 text-lg border border-gray-300 shadow-sm rounded-lg focus:ring-primary focus:border-transparent transition-colors"
          >
            <option value="">ທັງໝົດ</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {reports.length === 0 ? (
        <p className="text-center text-secondary text-xl">ບໍ່ມີລາຍງານສຳລັບຊ່ວງເວລາທີ່ເລືອກ</p>
      ) : (
        <div className="space-y-6">
          {reports.map(report => (
            <div
              key={report.id}
              className="bg-background p-6 rounded-xl shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-300"
              onClick={() => navigate(`/report/${report.id}`)}
            >
              <p className="text-xl font-semibold text-primary mb-2">ວັນທີ: {new Date(report.date).toLocaleDateString('en-GB')}</p>
              <p className="text-lg text-secondary mb-1">
                ເມນູທີ່ຊະນະ: {typeof report.winning_food_name === 'object' && report.winning_food_name !== null ? report.winning_food_name.name : report.winning_food_name || 'ບໍ່ມີ'}
              </p>
              <p className="text-lg text-secondary">ຈຳນວນໂຫວດທັງໝົດ: {report.total_votes}</p>
              <div className="mt-4">
                <p className="font-semibold text-primary mb-2">ລາຍລະອຽດການໂຫວດ:</p>
                {report.vote_details && Array.isArray(report.vote_details) ? (
                  report.vote_details.map((pack, index) => (
                    <p key={index} className="text-base text-secondary ml-4">- {pack.name}: {pack.votes} ໂຫວດ</p>
                  ))
                ) : report.vote_details && typeof report.vote_details === 'object' ? (
                  Object.entries(report.vote_details).map(([foodId, votes]) => (
                    <p key={foodId} className="text-base text-secondary ml-4">- ID {foodId}: {votes} ໂຫວດ</p>
                  ))
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GMReport;