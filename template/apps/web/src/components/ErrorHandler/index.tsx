import { FC } from 'react';
import { useHandleUrlError } from 'hooks';

export const ErrorHandler: FC = () => {
  useHandleUrlError();

  return null;
};

export default ErrorHandler;
