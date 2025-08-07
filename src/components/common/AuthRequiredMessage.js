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
    <div className="flex items-center justify-center h-screen text-primary text-xl font-bold text-center">
      {message}
    </div>
  );
};

export default AuthRequiredMessage;
