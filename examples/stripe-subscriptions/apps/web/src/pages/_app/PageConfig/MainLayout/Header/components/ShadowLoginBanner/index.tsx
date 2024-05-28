import React, { FC } from 'react';
import { Center, Text } from '@mantine/core';

interface ShadowLoginBannerProps {
  email: string;
}

const ShadowLoginBanner: FC<ShadowLoginBannerProps> = ({ email }) => (
  <Center h={40} bg="gray.3">
    <Text>
      You currently under the shadow login as{' '}
      <Text fw={600} span>
        {email}
      </Text>
    </Text>
  </Center>
);

export default ShadowLoginBanner;
