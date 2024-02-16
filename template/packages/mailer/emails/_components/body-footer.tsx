import React from 'react';
import { Text } from '@react-email/components';

const BodyFooter = () => (
  <Text className="mt-10 text-center text-zinc-500">
    ©
    {' '}
    {new Date().getFullYear()}
    {' '}
    Ship, All Rights Reserved
    {' '}
    <br />
    651 N Broad St, Suite 206, Middletown,
    19709, Delaware, United States
  </Text>
);

export default BodyFooter;
