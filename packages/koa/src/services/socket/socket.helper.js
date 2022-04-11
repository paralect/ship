exports.getCookie = (cookieString, name) => {
  const value = `; ${cookieString}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts
      .pop()
      .split(';')
      .shift();
  }

  return null;
};

exports.checkAccessToRoom = (roomId, data) => {
  const [roomType, id] = roomId.split('-');

  switch (roomType) {
    case 'user':
      return id === data.userId;
    default:
      return false;
  }
};
