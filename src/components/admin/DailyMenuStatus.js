import React, { useState, useEffect, useCallback } from 'react';

const DailyMenuStatus = ({ BACKEND_URL, showMessage, foodItems, onCreateMenuAndNavigate, selectedDate, setSelectedDate }) => {
  const [dailyMenu, setDailyMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDailyMenuForSelectedDate = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/api/daily-menu/${selectedDate}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setDailyMenu(data);
    } catch (err) {
      console.error(`Error fetching daily menu for ${selectedDate}:`, err);
      setError(err.message);
      showMessage('ບໍ່ສາມາດໂຫຼດສະຖານະເມນູປະຈຳວັນໄດ້', 'error');
    } finally {
      setLoading(false);
    }
  }, [BACKEND_URL, selectedDate, showMessage]);

  useEffect(() => {
    fetchDailyMenuForSelectedDate();
  }, [fetchDailyMenuForSelectedDate, selectedDate]); // Added selectedDate to dependency array

  const handleCreateMenu = () => {
    if (onCreateMenuAndNavigate) {
      onCreateMenuAndNavigate(selectedDate);
    }
  };

  const handleStatusChange = async (date, newStatus) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/daily-menu/${date}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) {
        throw new Error(`Failed to update status for ${date}`);
      }
      showMessage(`ອັບເດດສະຖານະເມນູສຳລັບ ${date} ເປັນ ${newStatus} ສຳເລັດແລ້ວ!`, 'success');
      fetchDailyMenuForSelectedDate(); // Re-fetch to update UI
    } catch (err) {
      console.error(`Error updating status for ${date}:`, err);
      showMessage(`ເກີດຂໍ້ຜິດພາດໃນການອັບເດດສະຖານະເມນູສຳລັບ ${date}`, 'error');
    }
  };

  const handleDeleteMenu = async (date) => {
    if (!window.confirm(`ທ່ານຕ້ອງການລຶບເມນູສຳລັບວັນທີ ${date} ແທ້ໆບໍ່?`)) {
      return;
    }
    try {
      const response = await fetch(`${BACKEND_URL}/api/daily-menu/${date}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Failed to delete menu for ${date}`);
      }
      showMessage(`ລຶບເມນູສຳລັບວັນທີ ${date} ສຳເລັດແລ້ວ!`, 'success');
      fetchDailyMenuForSelectedDate(); // Re-fetch to update UI
    } catch (err) {
      console.error(`Error deleting menu for ${date}:`, err);
      showMessage(`ເກີດຂໍ້ຜິດພາດໃນການລຶບເມນູສຳລັບວັນທີ ${date}`, 'error');
    }
  };

  const getFoodNameById = (id) => {
    const food = foodItems.find(item => item.id === id);
    return food ? food.name : 'ບໍ່ພົບເມນູ';
  };

  return (
    <div className="daily-menu-status-container p-4 bg-white rounded-lg shadow-md">
      <h3 className="mb-4 text-2xl font-bold text-teal-700">ສະຖານະເມນູປະຈຳວັນ</h3>

      <div className="mb-4">
        <label htmlFor="status-date-picker" className="block text-gray-700 text-sm font-bold mb-2">ເລືອກວັນທີ:</label>
        <input
          type="date"
          id="status-date-picker"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      {loading && <p className="text-center text-gray-600">ກຳລັງໂຫຼດສະຖານະເມນູ...</p>}
      {error && <p className="text-center text-red-500">ຂໍ້ຜິດພາດ: {error}</p>}

      {!loading && !error && dailyMenu && (
        <div className="bg-teal-50 p-4 rounded-lg shadow-lg">
          <h4 className="mb-2 text-xl font-semibold text-teal-800">ສະຖານະເມນູສຳລັບວັນທີ {new Date(dailyMenu.date).toLocaleDateString()}:</h4>
          <p><strong>ສະຖານະ:</strong> <span className={`font-bold ${dailyMenu.status === 'voting' ? 'text-blue-600' : dailyMenu.status === 'closed' ? 'text-red-600' : 'text-gray-600'}`}>{dailyMenu.status === 'idle' ? 'ບໍ່ມີກິດຈະກຳ' : dailyMenu.status === 'voting' ? 'ກຳລັງໂຫວດ' : dailyMenu.status === 'closed' ? 'ປິດໂຫວດແລ້ວ' : dailyMenu.status === 'admin_set' ? 'ແອັດມິນກຳນົດ' : dailyMenu.status}</span></p>

          {dailyMenu.status === 'idle' && (
            <div className="mt-4 text-center">
              <button
                onClick={handleCreateMenu}
                className="px-6 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition"
              >
                ສ້າງເມນູສຳລັບວັນທີນີ້
              </button>
            </div>
          )}

          {dailyMenu.status === 'voting' && dailyMenu.vote_options && dailyMenu.vote_options.length > 0 && (
            <div className="mt-4">
              <p><strong>ເມນູທີ່ກຳລັງໂຫວດ:</strong></p>
              <div className="flex flex-wrap gap-2">
                {dailyMenu.vote_options.map((pack, index) => (
                  <div key={index} className="flex items-center bg-white rounded-lg p-2 shadow-sm">
                    <span className="text-sm font-medium">{pack.name} ({pack.votes} ໂຫວດ)</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {dailyMenu.status === 'closed' && dailyMenu.winning_food_item_id && (
            <p className="mt-4"><strong>ເມນູທີ່ຊະນະ:</strong> {getFoodNameById(dailyMenu.winning_food_item_id)}</p>
          )}
          {dailyMenu.status === 'admin_set' && dailyMenu.admin_set_food_item_id && (
            <p className="mt-4"><strong>ເມນູທີ່ແອັດມິນຕັ້ງຄ່າ:</strong> {getFoodNameById(dailyMenu.admin_set_food_item_id)}</p>
          )}

          {/* Action buttons for status change and delete */}
          <div className="mt-4 flex space-x-2">
            {dailyMenu.status !== 'idle' && dailyMenu.status !== 'disabled' && (
              <button
                onClick={() => handleStatusChange(dailyMenu.date, 'disabled')}
                className="px-3 py-1 text-sm bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
              >
                ປິດໃຊ້ງານ
              </button>
            )}
            {dailyMenu.status === 'disabled' && (
              <button
                onClick={() => handleStatusChange(dailyMenu.date, 'idle')}
                className="px-3 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                ເປີດໃຊ້ງານ
              </button>
            )}
            <button
              onClick={() => handleDeleteMenu(dailyMenu.date)}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              ລຶບ
            </button>
          </div>
        </div>
      )}

      {!loading && !error && !dailyMenu && (
        <p className="text-center text-xl text-gray-600">ບໍ່ພົບສະຖານະເມນູສຳລັບວັນທີນີ້.</p>
      )}
    </div>
  );
};

export default DailyMenuStatus;