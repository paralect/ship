import React, { FC } from 'react';
import { Button as ReactEmailButton, ButtonProps } from '@react-email/components';

const Button: FC<ButtonProps> = ({ className, children, ...rest }) => (
  <ReactEmailButton
    className={`py-2 px-6 bg-black text-white rounded-md border-0 text-sm ${className}`}
    {...rest}
  >
    {children}
  </ReactEmailButton>
);

export default Button;
