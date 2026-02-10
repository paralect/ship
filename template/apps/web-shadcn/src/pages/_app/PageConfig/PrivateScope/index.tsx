import { FC, ReactElement, useEffect } from 'react';

import { socketService } from 'services';

interface PrivateScopeProps {
  children: ReactElement;
}

const PrivateScope: FC<PrivateScopeProps> = ({ children }) => {
  useEffect(() => {
    socketService.connect();

    return () => socketService.disconnect();
  }, []);

  return children;
};

export default PrivateScope;
