import { FC } from 'react';
import { AppShellFooter as LayoutFooter } from '@mantine/core';

import classes from './index.module.css';

const Footer: FC = () => {
  const year = new Date().getFullYear();

  return (
    <LayoutFooter
      className={classes.footer}
      mt="auto"
      px={0}
      py={12}
      bg="gray.0"
      ta="center"
      fz={12}
    >
      {`Ship ${year} © All rights reserved`}
    </LayoutFooter>
  );
};

export default Footer;
