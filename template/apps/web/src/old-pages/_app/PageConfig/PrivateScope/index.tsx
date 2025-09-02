import { FC, ReactNode, useEffect } from 'react';

import { socketService } from 'services';

interface PrivateScopeProps {
  children: ReactNode;
}

const PrivateScope: FC<PrivateScopeProps> = ({ children }) => {
  useEffect(() => {
    socketService.connect();

    return () => socketService.disconnect();
  }, []);

  return children;
};

export default PrivateScope;
