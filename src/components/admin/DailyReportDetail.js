import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'; // Changed import back to chart.js

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
        console.log('Report data:', reportData);
        console.log('Report vote_details:', reportData.vote_details);

        // Fetch food details for vote_details
        if (reportData.vote_details && Array.isArray(reportData.vote_details) && reportData.vote_details.length > 0) {
          const allFoodIdsInPacks = [...new Set(reportData.vote_details.flatMap(pack => pack.foodIds))];
          if (allFoodIdsInPacks.length > 0) {
            const foodDetailsResponse = await fetch(`${BACKEND_URL}/api/foods/batch`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ foodIds: allFoodIdsInPacks }),
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
        } else if (reportData.vote_details) { // Handle old format if it exists
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
        showMessage('ບໍ່ສາມາດໂຫຼດລາຍລະອຽດລາຍງານໄດ້', 'error');
      }
    };

    fetchReportDetail();
  }, [id, BACKEND_URL, showMessage]);

  // Prepare data for the Pie Chart
  const chartData = report && report.vote_details && Array.isArray(report.vote_details) && report.vote_details.length > 0 ? {
    labels: report.vote_details.map(pack => pack.name),
    datasets: [
      {
        label: 'ຈຳນວນໂຫວດ',
        data: report.vote_details.map(pack => pack.votes),
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
    return <div className="text-center text-xl text-gray-600">ກຳລັງໂຫຼດລາຍງານ...</div>;
  }

  return (
    <div className="max-w-4xl p-8 mx-auto mb-10 bg-white border border-teal-200 shadow-2xl rounded-2xl">
      <h3 className="text-3xl font-bold text-center text-teal-700 mb-6">ລາຍລະອຽດລາຍງານປະຈຳວັນ</h3>
      <p className="text-lg font-semibold text-gray-800 mb-2">ວັນທີ: {new Date(report.date).toLocaleDateString()}</p>
      <p className="text-lg text-gray-700 mb-2">ເມນູທີ່ຊະນະ: {report.winning_food_name || 'ບໍ່ມີ'}</p>
      <p className="text-lg text-gray-700 mb-4">ຈຳນວນໂຫວດທັງໝົດ: {report.total_votes}</p>

      {chartData && report.total_votes > 0 && (
        <div className="mb-8">
          <h4 className="text-xl font-semibold text-teal-700 mb-4 text-center">ສັດສ່ວນການໂຫວດ:</h4>
          <div className="w-full max-w-md mx-auto">
            <Pie data={chartData} />
          </div>
        </div>
      )}

      <h4 className="text-xl font-semibold text-teal-700 mb-4">ຜົນການໂຫວດແຕ່ລະເມນູ:</h4>
      {report.vote_details && Array.isArray(report.vote_details) && report.vote_details.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {report.vote_details.map((pack, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-xl shadow-lg flex items-center space-x-4">
              <div className="flex space-x-2">
                {pack.foodIds.map(foodId => {
                  const food = foodDetails[foodId];
                  return food ? (
                    <img
                      key={food.id}
                      src={food.image}
                      alt={food.name}
                      className="w-16 h-16 object-cover rounded-lg"
                      onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x300/CCCCCC/000000?text=Image+Not+Found`; }}
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">ບໍ່ມີຮູບ</div>
                  );
                })}
              </div>
              <div className="flex-grow">
                <p className="text-lg font-semibold">{pack.name}</p>
                <p className="text-md text-gray-700">ໂຫວດ: {pack.votes}</p>
              </div>
            </div>
          ))}
        </div>
      ) : report.vote_details && Object.entries(report.vote_details).length > 0 ? (
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
                  <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">ບໍ່ມີຮູບ</div>
                )}
                <div>
                  <p className="text-lg font-semibold">{food ? food.name : `ID ອາຫານ: ${foodId}`}</p>
                  <p className="text-md text-gray-700">ໂຫວດ: {votes}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-600">ບໍ່ມີລາຍລະອຽດການໂຫວດ</p>
      )}
    </div>
  );
};

export default DailyReportDetail;