const getAuthStatusFromUrl = (location) => {
  const urlParams = new URLSearchParams(location.search);
  const userIdFromUrl = urlParams.get('userID');

  let userId = null;
  let errorType = null;

  if (userIdFromUrl) {
    if (userIdFromUrl.toLowerCase() === 'emtry') {
      errorType = 'invalid_userid';
    } else {
      userId = userIdFromUrl;
    }
  }

  return { userId, errorType };
};

export default getAuthStatusFromUrl;