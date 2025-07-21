import React, { useState, useEffect } from 'react';

const GMReport = ({ BACKEND_URL, showMessage }) => {
  const [reports, setReports] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i); // Last 5 years
  const months = [
    { value: '01', label: 'มกราคม' },
    { value: '02', label: 'กุมภาพันธ์' },
    { value: '03', label: 'มีนาคม' },
    { value: '04', label: 'เมษายน' },
    { value: '05', label: 'พฤษภาคม' },
    { value: '06', label: 'มิถุนายน' },
    { value: '07', label: 'กรกฎาคม' },
    { value: '08', label: 'สิงหาคม' },
    { value: '09', label: 'กันยายน' },
    { value: '10', label: 'ตุลาคม' },
    { value: '11', label: 'พฤศจิกายน' },
    { value: '12', label: 'ธันวาคม' },
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
        showMessage('ไม่สามารถโหลดรายงานได้', 'error');
      }
    };

    fetchReports();
  }, [BACKEND_URL, selectedMonth, selectedYear, showMessage]);

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h3 className="text-2xl font-bold text-center text-teal-700 mb-6">รายงานผลโหวตประจำวัน</h3>

      <div className="flex justify-center space-x-4 mb-6">
        <div>
          <label htmlFor="month-select" className="block text-sm font-medium text-gray-700">เลือกเดือน:</label>
          <select
            id="month-select"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
          >
            <option value="">ทั้งหมด</option>
            {months.map(month => (
              <option key={month.value} value={month.value}>{month.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="year-select" className="block text-sm font-medium text-gray-700">เลือกปี:</label>
          <select
            id="year-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
          >
            <option value="">ทั้งหมด</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {reports.length === 0 ? (
        <p className="text-center text-gray-600">ไม่มีรายงานสำหรับช่วงเวลาที่เลือก</p>
      ) : (
        <div className="space-y-6">
          {reports.map(report => (
            <div key={report.id} className="bg-gray-50 p-4 rounded-xl shadow-md">
              <p className="text-lg font-semibold text-teal-800">วันที่: {new Date(report.date).toLocaleDateString()}</p>
              <p className="text-md text-gray-700">เมนูที่ชนะ: {report.winning_food_name || 'ไม่มี'}</p>
              <p className="text-md text-gray-700">จำนวนโหวตทั้งหมด: {report.total_votes}</p>
              <div className="mt-2">
                <p className="font-medium">รายละเอียดการโหวต:</p>
                {report.vote_details && Object.entries(report.vote_details).map(([foodId, votes]) => (
                  <p key={foodId} className="text-sm text-gray-600 ml-4">- {foodId} (ID): {votes} โหวต</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GMReport;