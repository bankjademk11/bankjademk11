import React from 'react';

const StatCard = ({ icon, title, value, change, changeType }) => {
  const changeColor = changeType === 'increase' ? 'text-green-500' : 'text-red-500';

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
        {change && (
          <div className="flex items-center mt-1">
            <p className={`text-sm font-semibold ${changeColor}`}>{change}</p>
            <p className="text-xs text-gray-400 ml-1">from last week</p>
          </div>
        )}
      </div>
      <div className="bg-blue-100 p-4 rounded-full">
        {icon}
      </div>
    </div>
  );
};

export default StatCard;