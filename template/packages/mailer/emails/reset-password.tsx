import React, { FC } from 'react';
import { Text } from '@react-email/components';

import Layout from './_layout';
import Button from './components/button';

export interface ResetPasswordProps {
  firstName: string;
  href: string;
}

export const ResetPassword:FC<ResetPasswordProps> = ({
  firstName = 'John',
  href = 'https://ship.paralect.com',
}) => (
  <Layout previewText="Reset password">
    <Text>
      Dear
      {' '}
      {firstName}
      ,
    </Text>

    <Text>
      We received a request to reset the password for your account associated with this email address.
      If you made this request, please follow the instructions below.
    </Text>

    <Text>
      Click the button below to reset your password:
    </Text>

    <Button className="mb-5" href={href}>
      Reset password
    </Button>

    <Text>
      If you did not request to reset your password, please ignore this email
      or contact our support team if you believe this is an error.
      Your password will remain the same unless you create a new one via the link provided above.
    </Text>
  </Layout>
);

export default ResetPassword;
