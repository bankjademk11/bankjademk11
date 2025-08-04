import React, { useState, useEffect, useCallback, useMemo } from 'react';
import AllVotedMenusSummaryPopup from './AllVotedMenusSummaryPopup';

const DailyMenuStatus = ({ BACKEND_URL, showMessage, foodItems, onCreateMenuAndNavigate, selectedDate, setSelectedDate, handleCloseVoting, handleEditMenuAndNavigateToVoting }) => {
  const [dailyMenu, setDailyMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [showAllVotedMenusPopup, setShowAllVotedMenusPopup] = useState(false);

  const handleOpenAllVotedMenusPopup = () => {
    setShowAllVotedMenusPopup(true);
  };

  const handleCloseAllVotedMenusPopup = () => {
    setShowAllVotedMenusPopup(false);
  };

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

  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  const confirmDelete = async () => {
    if (!dailyMenu) return;
    const { date } = dailyMenu;
    closeDeleteModal();
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

  const actionButtonProps = useMemo(() => {
    if (!dailyMenu) return { disabled: true, title: '' };

    const { status } = dailyMenu;
    // Buttons are enabled ONLY when status is 'disabled'
    const disabled = status !== 'disabled';
    let title = '';

    if (disabled) {
      switch (status) {
        case 'idle':
          title = 'ບໍ່ສາມາດແກ້ໄຂ ຫຼື ລຶບໄດ້ໃນສະຖານະບໍ່ມີກິດຈະກຳ';
          break;
        case 'voting':
          title = 'ບໍ່ສາມາດແກ້ໄຂ ຫຼື ລຶບໄດ້ໃນຂະນະທີ່ກຳລັງໂຫວດ';
          break;
        case 'admin_set':
          title = 'ບໍ່ສາມາດແກ້ໄຂ ຫຼື ລຶບໄດ້ເມື່ອແອັດມິນກຳນົດເມນູ';
          break;
        case 'closed':
          title = 'ບໍ່ສາມາດແກ້ໄຂ ຫຼື ລຶບໄດ້ເມື່ອປິດໂຫວດແລ້ວ';
          break;
        default:
          title = 'ບໍ່ສາມາດດຳເນີນການໄດ້ໃນສະຖານະນີ້';
      }
    } else {
      // Enabled state title
      title = 'ສາມາດແກ້ໄຂ ຫຼື ລຶບເມນູທີ່ປິດໃຊ້ງານໄດ້';
    }
    return { disabled, title };
  }, [dailyMenu]);


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
              <p className="text-lg font-semibold text-primary mb-3 cursor-pointer" onClick={handleOpenAllVotedMenusPopup}>ເມນູທີ່ກຳລັງໂຫວດ:</p>
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
                disabled={dailyMenu.status === 'admin_set'}
                title={dailyMenu.status === 'closed' ? 'ບໍ່ສາມາດປິດໃຊ້ງານເມນູທີ່ປິດໂຫວດແລ້ວ' : dailyMenu.status === 'admin_set' ? 'ບໍ່ສາມາດປິດໃຊ້ງານເມນູທີ່ແອັດມິນກຳນົດ' : ''}
              >
                🚫
              </button>
            )}
            {dailyMenu.status === 'disabled' && (
              <button
                onClick={() => handleStatusChange(dailyMenu.date, 'idle')}
                className="px-6 py-3 text-sm bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 transition-colors"
              >
                ✅
              </button>
            )}
            <button
              onClick={openDeleteModal}
              className="px-6 py-3 text-sm bg-red-500 text-white font-bold rounded-lg shadow-md hover:bg-red-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              disabled={actionButtonProps.disabled}
              title={actionButtonProps.title}
            >
              🗑️
            </button>
            <button
              onClick={() => handleEditMenuAndNavigateToVoting(dailyMenu.date, dailyMenu.vote_options)}
              className="px-6 py-3 text-sm bg-primary text-white font-bold rounded-lg shadow-md hover:bg-opacity-90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              disabled={actionButtonProps.disabled}
              title={actionButtonProps.title}
            >
              ✏️
            </button>
          </div>
        </div>
      )}

      {!loading && !error && !dailyMenu && (
        <p className="text-center text-xl text-secondary">ບໍ່ພົບສະຖານະເມນູສຳລັບວັນທີນີ້.</p>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl max-w-sm w-full">
            <h4 className="text-2xl font-bold text-center text-gray-800 mb-4">ຢືນຢັນການລຶບ</h4>
            <p className="text-center text-gray-600 mb-8">
              ທ່ານຕ້ອງການລຶບເມນູສຳລັບວັນທີ {dailyMenu && new Date(dailyMenu.date).toLocaleDateString()} ແທ້ໆບໍ່?
            </p>
            <div className="flex justify-around">
              <button
                onClick={closeDeleteModal}
                className="px-8 py-3 font-semibold rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
              >
                ຍົກເລີກ
              </button>
              <button
                onClick={confirmDelete}
                className="px-8 py-3 font-semibold rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                ຢືນຢັນການລຶບ
              </button>
            </div>
          </div>
        </div>
      )}

      {showAllVotedMenusPopup && (
        <AllVotedMenusSummaryPopup
          dailyMenu={dailyMenu}
          foodItems={foodItems}
          onClose={handleCloseAllVotedMenusPopup}
        />
      )}
    </div>
  );
};

export default DailyMenuStatus;