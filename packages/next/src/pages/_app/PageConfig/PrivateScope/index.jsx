import { useEffect } from 'react';

import { socketService } from 'services';

const PrivateScope = ({ children }) => {
  useEffect(() => {
    socketService.connect();

    return () => socketService.disconnect();
  }, []);

  return children;
};

export default PrivateScope;
