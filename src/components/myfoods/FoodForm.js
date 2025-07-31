import React, { useState, useEffect } from 'react';

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
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageInputType, setImageInputType] = useState('file'); // 'file' or 'url'

  useEffect(() => {
    if (editingFoodId && foodImage) {
      // If editing and foodImage is a URL, set input type to url
      if (foodImage.startsWith('http') || foodImage.startsWith('data:image')) {
        setImageInputType('url');
      } else {
        setImageInputType('file');
      }
    } else {
      setImageInputType('file'); // Default to file upload for new items
    }
  }, [editingFoodId, foodImage]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    if (e.target.files[0]) {
      setFoodImage(URL.createObjectURL(e.target.files[0]));
    } else {
      setFoodImage('');
    }
  };

  const handleUrlChange = (e) => {
    setFoodImage(e.target.value);
    setSelectedFile(null); // Clear selected file if URL is entered
  };

  const handleToggleInputType = () => {
    setImageInputType(prevType => (prevType === 'file' ? 'url' : 'file'));
    setFoodImage(''); // Clear image preview/URL when switching
    setSelectedFile(null); // Clear selected file when switching
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleAddOrUpdateFood(e, imageInputType === 'file' ? selectedFile : null);
  };

  return (
    <section className="max-w-3xl p-8 mx-auto mb-10 bg-surface shadow-lg rounded-2xl">
      <h2 className="mb-6 text-3xl font-bold text-center text-primary">
                {editingFoodId ? 'ແກ້ໄຂເມນູອາຫານສ່ວນຕົວ' : 'ເພີ່ມເມນູອາຫານສ່ວນຕົວໃໝ່'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="foodName" className="block mb-2 text-lg font-medium text-secondary">
            ຊື່ອາຫານ:
          </label>
          <input
            type="text"
            id="foodName"
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
            className="block w-full px-4 py-3 mt-1 text-lg border border-gray-300 shadow-sm rounded-lg focus:ring-primary focus:border-transparent"
            placeholder="ເຊັ່ນ: ຜັດໄທ, ຕົ້ມຍຳກຸ້ງ"
            required
          />
        </div>
        <div>
          <label htmlFor="foodImage" className="block mb-2 text-lg font-medium text-secondary">
            ຮູບພາບ:
          </label>
          <div className="flex items-center space-x-4 mb-4">
            <button
              type="button"
              onClick={handleToggleInputType}
              className="px-4 py-2 rounded-lg font-semibold transition-colors duration-300"
              style={{
                backgroundColor: imageInputType === 'file' ? '#4CAF50' : '#E0E0E0',
                color: imageInputType === 'file' ? 'white' : '#333',
              }}
            >
              ອັບໂຫຼດຈາກໄຟລ໌
            </button>
            <button
              type="button"
              onClick={handleToggleInputType}
              className="px-4 py-2 rounded-lg font-semibold transition-colors duration-300"
              style={{
                backgroundColor: imageInputType === 'url' ? '#4CAF50' : '#E0E0E0',
                color: imageInputType === 'url' ? 'white' : '#333',
              }}
            >
              ເພີ່ມຈາກ URL
            </button>
          </div>

          {imageInputType === 'file' ? (
            <input
              type="file"
              id="foodImage"
              onChange={handleFileChange}
              className="block w-full px-4 py-3 mt-1 text-lg border border-gray-300 shadow-sm rounded-lg focus:ring-primary focus:border-transparent"
              accept="image/*"
            />
          ) : (
            <input
              type="url"
              id="foodImage"
              value={foodImage}
              onChange={handleUrlChange}
              className="block w-full px-4 py-3 mt-1 text-lg border border-gray-300 shadow-sm rounded-lg focus:ring-primary focus:border-transparent"
              placeholder="https://example.com/padthai.jpg"
            />
          )}
          {foodImage && (
            <img src={foodImage} alt="Food Preview" className="mt-4 w-32 h-32 object-cover rounded-lg" />
          )}
        </div>
        <div>
          <label htmlFor="foodTags" className="block mb-2 text-lg font-medium text-secondary">
            ແທັກ (ຄັ່ນດ້ວຍເຄື່ອງໝາຍຈຸດ):
          </label>
          <input
            type="text"
            id="foodTags"
            value={foodTags}
            onChange={(e) => setFoodTags(e.target.value)}
            className="block w-full px-4 py-3 mt-1 text-lg border border-gray-300 shadow-sm rounded-lg focus:ring-primary focus:border-transparent"
            placeholder="ເຊັ່ນ: ອາຫານຈານດຽວ, ເສັ້ນ, ຍອດນິຍົມ, ທົ່ວໄປ, ອາຫານລາບໜ້າ"
          />
        </div>
        <div className="flex justify-center space-x-4">
          <button
            type="submit"
            className="px-8 py-3 font-bold text-white transition duration-300 ease-in-out transform bg-primary shadow-lg rounded-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
                        {editingFoodId ? 'ບັນທຶກການແກ້ໄຂ' : 'ເພີ່ມເມນູອາຫານ'}
          </button>
          {editingFoodId && (
            <button
              type="button"
              onClick={() => {
                setEditingFoodId(null);
                setFoodName('');
                setFoodImage('');
                setFoodTags('');
                setSelectedFile(null);
                setImageInputType('file'); // Reset to file input type
                showMessage('ຍົກເລີກການແກ້ໄຂ', 'info');
              }}
              className="px-8 py-3 font-bold text-white transition duration-300 ease-in-out transform bg-gray-400 shadow-lg rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
            >
              ຍົກເລີກ
            </button>
          )}
        </div>
      </form>
    </section>
  );
};

export default FoodForm;