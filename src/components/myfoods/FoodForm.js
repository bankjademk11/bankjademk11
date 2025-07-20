import React from 'react';

const FoodForm = ({
  foodName,
  setFoodName,
  foodImage,
  setFoodImage,
  foodTags,
  setFoodTags,
  editingFoodId,
  handleAddOrUpdateFood,
  setEditingFoodId,
  showMessage,
}) => {
  return (
    <section className="max-w-3xl p-8 mx-auto mb-10 bg-white border border-teal-200 shadow-xl rounded-2xl">
      <h2 className="mb-6 text-3xl font-bold text-center text-teal-700">
        {editingFoodId ? 'แก้ไขเมนูอาหารส่วนตัว' : 'เพิ่มเมนูอาหารส่วนตัวใหม่'}
      </h2>
      <form onSubmit={handleAddOrUpdateFood} className="space-y-5">
        <div>
          <label htmlFor="foodName" className="block mb-2 text-lg font-medium text-gray-700">
            ชื่ออาหาร:
          </label>
          <input
            type="text"
            id="foodName"
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
            className="block w-full px-4 py-3 mt-1 text-lg border border-gray-300 shadow-sm rounded-xl focus:ring-teal-500 focus:border-teal-500"
            placeholder="เช่น ผัดไทย, ต้มยำกุ้ง"
            required
          />
        </div>
        <div>
          <label htmlFor="foodImage" className="block mb-2 text-lg font-medium text-gray-700">
            URL รูปภาพ:
          </label>
          <input
            type="url"
            id="foodImage"
            value={foodImage}
            onChange={(e) => setFoodImage(e.target.value)}
            className="block w-full px-4 py-3 mt-1 text-lg border border-gray-300 shadow-sm rounded-xl focus:ring-teal-500 focus:border-teal-500"
            placeholder="https://example.com/padthai.jpg"
            required
          />
        </div>
        <div>
          <label htmlFor="foodTags" className="block mb-2 text-lg font-medium text-gray-700">
            แท็ก (คั่นด้วยคอมม่า):
          </label>
          <input
            type="text"
            id="foodTags"
            value={foodTags}
            onChange={(e) => setFoodTags(e.target.value)}
            className="block w-full px-4 py-3 mt-1 text-lg border border-gray-300 shadow-sm rounded-xl focus:ring-teal-500 focus:border-teal-500"
            placeholder="เช่น อาหารจานเดียว, เส้น, ยอดนิยม, ทั่วไป, อาหารราดหน้า"
          />
        </div>
        <div className="flex justify-center space-x-4">
          <button
            type="submit"
            className="px-8 py-3 font-bold text-white transition duration-300 ease-in-out transform bg-teal-600 shadow-lg rounded-xl hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 hover:scale-105"
          >
            {editingFoodId ? 'บันทึกการแก้ไข' : 'เพิ่มเมนูอาหาร'}
          </button>
          {editingFoodId && (
            <button
              type="button"
              onClick={() => {
                setEditingFoodId(null);
                setFoodName('');
                setFoodImage('');
                setFoodTags('');
                showMessage('ยกเลิกการแก้ไข', 'info');
              }}
              className="px-8 py-3 font-bold text-white transition duration-300 ease-in-out transform bg-gray-400 shadow-lg rounded-xl hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 hover:scale-105"
            >
              ยกเลิก
            </button>
          )}
        </div>
      </form>
    </section>
  );
};

export default FoodForm;