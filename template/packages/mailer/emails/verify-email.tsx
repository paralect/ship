import React, { FC } from 'react';
import { Text } from '@react-email/components';

import Layout from './_layout';
import Button from './components/button';

export interface VerifyEmailProps {
  firstName: string;
  href: string;
}

export const VerifyEmail:FC<VerifyEmailProps> = ({
  firstName = 'John',
  href = 'https://ship.paralect.com',
}) => (
  <Layout previewText="Welcome on board the Ship!">
    <Text>
      Dear
      {' '}
      {firstName}
      ,
    </Text>

    <Text>
      Welcome to Ship! We are excited to have you on board.
    </Text>

    <Text>
      Before we get started, we just need to verify your email address. This is to ensure that you have access to
      all our features and so we can send you important account notifications.
    </Text>

    <Text>
      Please verify your account by clicking the button below:
    </Text>

    <Button href={href}>
      Verify email
    </Button>
  </Layout>
);

export default VerifyEmail;
