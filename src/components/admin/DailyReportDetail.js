import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const DailyReportDetail = ({ BACKEND_URL, showMessage }) => {
  const { id } = useParams(); // Get report ID from URL
  const [report, setReport] = useState(null);
  const [foodDetails, setFoodDetails] = useState({}); // To store food name and image

  useEffect(() => {
    const fetchReportDetail = async () => {
      if (!BACKEND_URL || !id) return;

      try {
        const reportResponse = await fetch(`${BACKEND_URL}/api/daily-results/${id}`);
        if (!reportResponse.ok) {
          throw new Error(`HTTP error! status: ${reportResponse.status}`);
        }
        const reportData = await reportResponse.json();
        setReport(reportData);

        // Fetch food details for vote_details
        if (reportData.vote_details) {
          const foodIds = Object.keys(reportData.vote_details).map(Number);
          if (foodIds.length > 0) {
            const foodDetailsResponse = await fetch(`${BACKEND_URL}/api/foods/batch`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ foodIds }),
            });
            if (foodDetailsResponse.ok) {
              const foodDetailsData = await foodDetailsResponse.json();
              const detailsMap = foodDetailsData.reduce((acc, food) => {
                acc[food.id] = food;
                return acc;
              }, {});
              setFoodDetails(detailsMap);
            } else {
              console.error('Error fetching batch food details:', foodDetailsResponse.statusText);
            }
          }
        }

      } catch (error) {
        console.error("Error fetching report detail:", error);
        showMessage('ไม่สามารถโหลดรายละเอียดรายงานได้', 'error');
      }
    };

    fetchReportDetail();
  }, [id, BACKEND_URL, showMessage]);

  // Prepare data for the Pie Chart
  const chartData = report && report.vote_details ? {
    labels: Object.keys(report.vote_details).map(foodId => foodDetails[foodId] ? foodDetails[foodId].name : `Food ID: ${foodId}`),
    datasets: [
      {
        label: 'จำนวนโหวต',
        data: Object.values(report.vote_details),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  } : null;

  if (!report) {
    return <div className="text-center text-xl text-gray-600">กำลังโหลดรายงาน...</div>;
  }

  return (
    <div className="max-w-4xl p-8 mx-auto mb-10 bg-white border border-teal-200 shadow-2xl rounded-2xl">
      <h3 className="text-3xl font-bold text-center text-teal-700 mb-6">รายละเอียดรายงานประจำวัน</h3>
      <p className="text-lg font-semibold text-gray-800 mb-2">วันที่: {new Date(report.date).toLocaleDateString()}</p>
      <p className="text-lg text-gray-700 mb-2">เมนูที่ชนะ: {report.winning_food_name || 'ไม่มี'}</p>
      <p className="text-lg text-gray-700 mb-4">จำนวนโหวตทั้งหมด: {report.total_votes}</p>

      {chartData && report.total_votes > 0 && (
        <div className="mb-8">
          <h4 className="text-xl font-semibold text-teal-700 mb-4 text-center">สัดส่วนการโหวต:</h4>
          <div className="w-full max-w-md mx-auto">
            <Pie data={chartData} />
          </div>
        </div>
      )}

      <h4 className="text-xl font-semibold text-teal-700 mb-4">ผลโหวตแต่ละเมนู:</h4>
      {report.vote_details && Object.entries(report.vote_details).length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(report.vote_details).map(([foodId, votes]) => {
            const food = foodDetails[foodId];
            return (
              <div key={foodId} className="bg-gray-50 p-4 rounded-xl shadow-lg flex items-center space-x-4">
                {food && food.image ? (
                  <img
                    src={food.image}
                    alt={food.name}
                    className="w-24 h-24 object-cover rounded-lg"
                    onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x300/CCCCCC/000000?text=Image+Not+Found`; }}
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">ไม่มีรูป</div>
                )}
                <div>
                  <p className="text-lg font-semibold">{food ? food.name : `Food ID: ${foodId}`}</p>
                  <p className="text-md text-gray-700">โหวต: {votes}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-600">ไม่มีรายละเอียดการโหวต</p>
      )}
    </div>
  );
};

export default DailyReportDetail;