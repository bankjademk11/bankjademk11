import React from 'react';
import { useLocation } from 'react-router-dom';

const AuthRequiredMessage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const errorType = queryParams.get('error');

  let message = "ກະລຸນາເຂົ້າສູ່ລະບົບຜ່ານລິ້ງທີ່ທ່ານໄດ້ຮັບ."; // Default message

  if (errorType === 'no_userid') {
    message = "ບໍ່ພົບ User ID. ກະລຸນາເຂົ້າສູ່ລະບົບຜ່ານລິ້ງທີ່ມີ User ID.";
  } else if (errorType === 'invalid_userid') {
    message = "User ID ບໍ່ຖືກຕ້ອງ. ກະລຸນາໃຊ້ User ID ທີ່ຖືກຕ້ອງ.";
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-50 to-teal-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="text-5xl text-teal-600 mb-6">⚠️</div>
        <h2 className="text-2xl font-bold text-teal-800 mb-4">ການເຂົ້າເຖິງຖືກປະຕິເສດ</h2>
        <p className="text-gray-700 text-lg">{message}</p>
        <div className="mt-8 p-4 bg-teal-50 rounded-lg">
          <p className="text-sm text-teal-700">
            ຖ້າທ່ານຄິດວ່ານີ້ແມ່ນຂໍ້ຜິດພາດ, ກະລຸນາຕິດຕໍ່ຜູ້ດູແລລະບົບ.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthRequiredMessage;
