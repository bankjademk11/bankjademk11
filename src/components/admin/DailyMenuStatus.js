import React, { useState, useEffect, useCallback } from 'react';

const DailyMenuStatus = ({ BACKEND_URL, showMessage, foodItems, onCreateMenuAndNavigate, selectedDate, setSelectedDate, handleCloseVoting, handleEditMenuAndNavigateToVoting }) => {
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
  }, [fetchDailyMenuForSelectedDate, selectedDate]);

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
      fetchDailyMenuForSelectedDate();
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
      fetchDailyMenuForSelectedDate();
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
    <div className="p-6 bg-surface rounded-2xl shadow-lg">
      <h3 className="mb-6 text-3xl font-bold text-center text-primary">ສະຖານະເມນູປະຈຳວັນ</h3>

      <div className="mb-6">
        <label htmlFor="status-date-picker" className="block text-secondary text-lg font-semibold mb-2">ເລືອກວັນທີ:</label>
        <input
          type="date"
          id="status-date-picker"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="block w-full px-4 py-3 mt-1 text-lg border border-gray-300 shadow-sm rounded-lg focus:ring-primary focus:border-transparent transition-colors"
        />
      </div>

      {loading && <p className="text-center text-secondary">ກຳລັງໂຫຼດສະຖານະເມນູ...</p>}
      {error && <p className="text-center text-red-500">ຂໍ້ຜິດພາດ: {error}</p>}

      {!loading && !error && dailyMenu && (
        <div className="bg-background p-6 rounded-lg shadow-md">
          <h4 className="mb-4 text-xl font-semibold text-primary">ສະຖານະເມນູສຳລັບວັນທີ {new Date(dailyMenu.date).toLocaleDateString()}:</h4>
          <p className="mb-4 text-lg"><strong>ສະຖານະ:</strong> <span className={`font-bold ${dailyMenu.status === 'voting' ? 'text-blue-600' : dailyMenu.status === 'closed' ? 'text-red-600' : dailyMenu.status === 'admin_set' ? 'text-green-600' : 'text-secondary'}`}>{dailyMenu.status === 'idle' ? 'ບໍ່ມີກິດຈະກຳ' : dailyMenu.status === 'voting' ? 'ກຳລັງໂຫວດ' : dailyMenu.status === 'closed' ? 'ປິດໂຫວດແລ້ວ' : dailyMenu.status === 'admin_set' ? 'ແອັດມິນກຳນົດ' : dailyMenu.status}</span></p>

          {dailyMenu.status === 'idle' && (
            <div className="mt-6 text-center">
              <button
                onClick={handleCreateMenu}
                className="px-6 py-3 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-opacity-90 transition-colors"
              >
                ສ້າງເມນູສຳລັບວັນທີນີ້
              </button>
            </div>
          )}

          {dailyMenu.status === 'voting' && dailyMenu.vote_options && dailyMenu.vote_options.length > 0 && (
            <div className="mt-6">
              <p className="text-lg font-semibold text-primary mb-3">ເມນູທີ່ກຳລັງໂຫວດ:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {dailyMenu.vote_options.map((pack, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 shadow-sm flex items-center justify-between">
                    <span className="text-base font-medium text-primary">{pack.name}</span>
                    <span className="text-base font-semibold text-accent">{pack.votes} ໂຫວດ</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <button
                  onClick={() => handleCloseVoting(dailyMenu.date)}
                  className="px-6 py-3 bg-red-500 text-white font-bold rounded-lg shadow-md hover:bg-red-600 transition-colors"
                >
                  ປິດໂຫວດ
                </button>
              </div>
            </div>
          )}

          {dailyMenu.status === 'closed' && dailyMenu.winning_food_item_id && (
            <p className="mt-6 text-lg"><strong>ເມນູທີ່ຊະນະ:</strong> <span className="font-semibold text-primary">{getFoodNameById(dailyMenu.winning_food_item_id)}</span></p>
          )}
          {dailyMenu.status === 'admin_set' && dailyMenu.admin_set_food_item_id && (
            <p className="mt-6 text-lg"><strong>ເມນູທີ່ແອັດມິນຕັ້ງຄ່າ:</strong> <span className="font-semibold text-primary">{getFoodNameById(dailyMenu.admin_set_food_item_id)}</span></p>
          )}

          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            {dailyMenu.status !== 'disabled' && (
              <button
                onClick={() => handleStatusChange(dailyMenu.date, 'disabled')}
                className="px-6 py-3 text-sm bg-gray-400 text-white font-bold rounded-lg shadow-md hover:bg-gray-500 transition-colors"
              >
                ປິດໃຊ້ງານ
              </button>
            )}
            {dailyMenu.status === 'disabled' && (
              <button
                onClick={() => handleStatusChange(dailyMenu.date, 'idle')}
                className="px-6 py-3 text-sm bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 transition-colors"
              >
                ເປີດໃຊ້ງານ
              </button>
            )}
            <button
              onClick={() => handleDeleteMenu(dailyMenu.date)}
              className="px-6 py-3 text-sm bg-red-500 text-white font-bold rounded-lg shadow-md hover:bg-red-600 transition-colors"
              disabled={dailyMenu.status !== 'idle'}
            >
              ລຶບ
            </button>
            <button
              onClick={() => handleEditMenuAndNavigateToVoting(dailyMenu.date, dailyMenu.vote_options)}
              className="px-6 py-3 text-sm bg-primary text-white font-bold rounded-lg shadow-md hover:bg-opacity-90 transition-colors"
              disabled={dailyMenu.status !== 'idle'}
            >
              ແກ້ໄຂ
            </button>
          </div>
        </div>
      )}

      {!loading && !error && !dailyMenu && (
        <p className="text-center text-xl text-secondary">ບໍ່ພົບສະຖານະເມນູສຳລັບວັນທີນີ້.</p>
      )}
    </div>
  );
};

export default DailyMenuStatus;