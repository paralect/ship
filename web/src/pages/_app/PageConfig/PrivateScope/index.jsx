import { useEffect } from 'react';

import * as socketService from 'services/socket.service';

const PrivateScope = ({ children }) => {
  useEffect(() => {
    socketService.connect();

    return () => socketService.disconnect();
  }, []);

  return children;
};

export default PrivateScope;
