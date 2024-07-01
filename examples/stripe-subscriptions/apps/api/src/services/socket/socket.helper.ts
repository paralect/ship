const getCookie = (cookieString: string, name: string) => {
  const value = `; ${cookieString}`;
  const parts = value.split(`; ${name}=`);
  if (parts && parts.length === 2) {
    const part = parts.pop();
    if (!part) {
      return null;
    }

    return part.split(';').shift();
  }

  return null;
};

const checkAccessToRoom = (roomId: string, data: { userId: string }) => {
  const [roomType, ...rest] = roomId.split('-');
  const id = rest.join('-');

  switch (roomType) {
    case 'user':
      return id === data.userId;
    default:
      return false;
  }
};

export default {
  getCookie,
  checkAccessToRoom,
};
