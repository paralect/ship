import { FC, ReactElement } from 'react';

import { SimpleGrid, Image } from '@mantine/core';

import classes from './UnauthorizedLayout.module.css';

interface UnauthorizedLayoutProps {
  children: ReactElement;
}

const UnauthorizedLayout: FC<UnauthorizedLayoutProps> = ({ children }) => (
  <SimpleGrid
    cols={{ base: 1, sm: 2 }}
    spacing="sm"
  >
    <Image
      className={classes.image}
      alt="App Info"
      src="/images/ship.svg"
      height="100vh"
    />

    <div className={classes.wrapper}>
      <main className={classes.content}>
        {children}
      </main>
    </div>
  </SimpleGrid>
);

export default UnauthorizedLayout;
