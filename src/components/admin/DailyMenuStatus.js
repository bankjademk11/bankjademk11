import React, { useState, useEffect, useCallback } from 'react';

const DailyMenuStatus = ({ BACKEND_URL, showMessage, foodItems }) => {
  const [allDailyMenus, setAllDailyMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllDailyMenus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/api/daily-menu/all`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAllDailyMenus(data);
    } catch (err) {
      console.error("Error fetching all daily menus:", err);
      setError(err.message);
      showMessage('ບໍ່ສາມາດໂຫຼດສະຖານະເມນູປະຈຳວັນໄດ້', 'error');
    } finally {
      setLoading(false);
    }
  }, [BACKEND_URL, showMessage]);

  useEffect(() => {
    fetchAllDailyMenus();
    // Optionally, poll for updates
    const intervalId = setInterval(fetchAllDailyMenus, 10000); // Poll every 10 seconds
    return () => clearInterval(intervalId);
  }, [BACKEND_URL, showMessage, fetchAllDailyMenus]);

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
      fetchAllDailyMenus(); // Re-fetch to update UI
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
      fetchAllDailyMenus(); // Re-fetch to update UI
    } catch (err) {
      console.error(`Error deleting menu for ${date}:`, err);
      showMessage(`ເກີດຂໍ້ຜິດພາດໃນການລຶບເມນູສຳລັບວັນທີ ${date}`, 'error');
    }
  };

  const getFoodNameById = (id) => {
    const food = foodItems.find(item => item.id === id);
    return food ? food.name : 'ບໍ່ພົບເມນູ';
  };

  const today = new Date().toISOString().split('T')[0];
  const currentMenu = allDailyMenus.find(menu => menu.date === today);
  const upcomingMenus = allDailyMenus.filter(menu => menu.date > today).sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="daily-menu-status-container">
      <h3 className="mb-4 text-2xl font-bold text-teal-700">ສະຖານະເມນູປະຈຳວັນ</h3>

      {loading && <p className="text-center text-gray-600">ກຳລັງໂຫຼດສະຖານະເມນູ...</p>}
      {error && <p className="text-center text-red-500">ຂໍ້ຜິດພາດ: {error}</p>}

      {!loading && !error && (
        <>
          {/* Current Day's Menu */}
          <div className="mb-6 p-4 border rounded-lg bg-teal-50 shadow-lg">
            <h4 className="mb-2 text-xl font-semibold text-teal-800">ເມນູປະຈຳວັນນີ້ ({today}):</h4>
            {currentMenu ? (
              <div>
                <p><strong>ສະຖານະ:</strong> {currentMenu.status}</p>
                {currentMenu.status === 'voting' && currentMenu.vote_options && currentMenu.vote_options.length > 0 && (
                  <div>
                    <p><strong>ເມນູທີ່ກຳລັງໂຫວດ:</strong></p>
                    <div className="flex flex-wrap gap-2">
                      {currentMenu.vote_options.map(food => (
                        <div key={food.foodItemId} className="flex items-center bg-white rounded-lg p-2 shadow-sm">
                          <img src={food.image} alt={food.name} className="w-8 h-8 object-cover rounded-md mr-2" onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x300/CCCCCC/000000?text=NF`; }} />
                          <span className="text-sm font-medium">{food.name} ({food.votes} ໂຫວດ)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {currentMenu.status === 'closed' && currentMenu.winning_food_item_id && (
                  <p><strong>ເມນູທີ່ຊະນະ:</strong> {getFoodNameById(currentMenu.winning_food_item_id)}</p>
                )}
                {currentMenu.status === 'admin_set' && currentMenu.admin_set_food_item_id && (
                  <p><strong>ເມນູທີ່ແອັດມິນຕັ້ງຄ່າ:</strong> {getFoodNameById(currentMenu.admin_set_food_item_id)}</p>
                )}
                {currentMenu.status === 'idle' && <p>ຍັງບໍ່ມີການຕັ້ງຄ່າເມນູສຳລັບມື້ນີ້</p>}
                {currentMenu.status === 'disabled' && <p>ເມນູສຳລັບມື້ນີ້ຖືກປິດໃຊ້ງານ</p>}
              </div>
            ) : (
              <p>ຍັງບໍ່ມີຂໍ້ມູນເມນູສຳລັບມື້ນີ້</p>
            )}
          </div>

          {/* Upcoming Menus */}
          <div className="mb-6 p-4 border rounded-lg bg-blue-50 shadow-lg">
            <h4 className="mb-2 text-xl font-semibold text-blue-800">ເມນູທີ່ຈະມາເຖິງ:</h4>
            {upcomingMenus.length > 0 ? (
              <div className="space-y-4">
                {upcomingMenus.map(menu => (
                  <div key={menu.date} className="p-3 border rounded-lg bg-white shadow-sm">
                    <p><strong>ວັນທີ:</strong> {menu.date}</p>
                    <p><strong>ສະຖານະ:</strong> {menu.status}</p>
                    {menu.status === 'voting' && menu.vote_options && menu.vote_options.length > 0 && (
                      <div>
                        <p><strong>ເມນູໂຫວດ:</strong></p>
                        <div className="flex flex-wrap gap-2">
                          {menu.vote_options.map(food => (
                            <div key={food.foodItemId} className="flex items-center bg-gray-100 rounded-lg p-1 text-sm">
                              <img src={food.image} alt={food.name} className="w-6 h-6 object-cover rounded-md mr-1" onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x300/CCCCCC/000000?text=NF`; }} />
                              <span>{food.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {menu.status === 'admin_set' && menu.admin_set_food_item_id && (
                      <p><strong>ເມນູທີ່ແອັດມິນຕັ້ງຄ່າ:</strong> {getFoodNameById(menu.admin_set_food_item_id)}</p>
                    )}
                    <div className="mt-2 flex space-x-2">
                      {menu.status !== 'idle' && menu.status !== 'disabled' && (
                        <button
                          onClick={() => handleStatusChange(menu.date, 'disabled')}
                          className="px-3 py-1 text-sm bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                        >
                          ປິດໃຊ້ງານ
                        </button>
                      )}
                      {menu.status === 'disabled' && (
                        <button
                          onClick={() => handleStatusChange(menu.date, 'idle')}
                          className="px-3 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600"
                        >
                          ເປີດໃຊ້ງານ
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteMenu(menu.date)}
                        className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
                      >
                        ລຶບ
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">ຍັງບໍ່ມີເມນູທີ່ຈະມາເຖິງ</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DailyMenuStatus;
