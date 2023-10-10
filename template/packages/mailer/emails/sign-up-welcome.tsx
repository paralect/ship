import React, { FC } from 'react';
import { Text } from '@react-email/components';

import Layout from './_layout';
import Button from './components/button';

export interface SignUpWelcomeProps {
  firstName: string;
  href: string;
}

export const SignUpWelcome:FC<SignUpWelcomeProps> = ({
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
      We are excited to have you join our growing Ship community.
    </Text>

    <Text>
      Your account has been successfully verified, and you are now a part of a vibrant network of people
      who share your interest in our digital services. We are confident that our platform will offer you
      the tools, resources, and connections you need to succeed.
    </Text>

    <Button href={href}>
      Get Started
    </Button>
  </Layout>
);

export default SignUpWelcome;
