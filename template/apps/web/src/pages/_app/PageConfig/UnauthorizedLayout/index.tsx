import { FC, ReactElement } from 'react';

import {
  SimpleGrid,
  Image,
  MediaQuery,
} from '@mantine/core';

import { useStyles } from './styles';

interface UnauthorizedLayoutProps {
  children: ReactElement;
}

const UnauthorizedLayout: FC<UnauthorizedLayoutProps> = ({ children }) => {
  const { classes } = useStyles();
  return (
    <SimpleGrid
      cols={2}
      breakpoints={[
        { maxWidth: 'sm', cols: 1, spacing: 'sm' },
      ]}
    >
      <MediaQuery
        smallerThan="sm"
        styles={{ display: 'none' }}
      >
        <Image
          alt="app info"
          src="../images/ship.svg"
          height="100vh"
        />
      </MediaQuery>

      <div className={classes.wrapper}>
        <main className={classes.content}>
          {children}
        </main>
      </div>
    </SimpleGrid>
  );
};

export default UnauthorizedLayout;
