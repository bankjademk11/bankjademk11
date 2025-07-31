import React from 'react';

const categories = ['ທັງໝົດ', 'ອາຫານລາບໜ້າ', 'ທົ່ວໄປ', 'ເສັ້ນ'];

const CategoryFilter = ({ selectedCategory, setSelectedCategory }) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-6">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setSelectedCategory(category)}
          className={`
            px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 ease-in-out
            ${selectedCategory === category
              ? 'bg-primary text-white shadow-md'
              : 'bg-surface text-secondary border border-gray-200 hover:bg-gray-100'
            }
          `}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;