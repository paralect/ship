import PropTypes from 'prop-types';

import {
  SimpleGrid,
  Image,
  MediaQuery,
} from '@mantine/core';

import { useStyles } from './styles';

const UnauthorizedLayout = ({ children }) => {
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

UnauthorizedLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default UnauthorizedLayout;
