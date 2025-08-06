import React from 'react';

const StatCard = ({ icon, title, value, change, changeType }) => {
  const changeColor = changeType === 'increase' ? 'text-green-500' : 'text-red-500';

  return (
    <div className="bg-surface p-6 rounded-2xl shadow-subtle flex items-center justify-between transition-all duration-300 hover:shadow-md hover:-translate-y-1">
      <div>
        <p className="text-sm font-medium text-neutral-500">{title}</p>
        <p className="text-3xl font-bold text-neutral-800">{value}</p>
        {change && (
          <div className="flex items-center mt-1">
            <p className={`text-sm font-semibold ${changeColor}`}>{change}</p>
            <p className="text-xs text-neutral-400 ml-1">from last week</p>
          </div>
        )}
      </div>
      <div className="bg-primary-light/20 p-4 rounded-full">
        {icon}
      </div>
    </div>
  );
};

export default StatCard;