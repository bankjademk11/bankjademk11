import React from 'react';

const CategoryFilter = ({ selectedCategory, setSelectedCategory, label, idPrefix = "" }) => {
  return (
    <div className="mb-6 text-center">
      <label htmlFor={`${idPrefix}-category-filter`} className="block mb-2 text-lg font-medium text-gray-700">
        {label}
      </label>
      <select
        id={`${idPrefix}-category-filter`}
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="block w-full max-w-xs mx-auto px-4 py-3 mt-1 text-lg border border-gray-300 shadow-sm rounded-xl focus:ring-teal-500 focus:border-teal-500"
      >
        <option value="ทั้งหมด">ทั้งหมด</option>
        <option value="อาหารราดหน้า">อาหารราดหน้า</option>
        <option value="ทั่วไป">ทั่วไป</option>
        <option value="เส้น">เส้น</option>
      </select>
    </div>
  );
};

export default CategoryFilter;