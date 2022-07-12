import PropTypes from 'prop-types';
import { AppShell } from '@mantine/core';

import Header from './Header';
import Footer from './Footer';

const MainLayout = ({ children }) => (
  <AppShell
    header={<Header />}
    footer={<Footer />}
    styles={(theme) => ({
      root: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: theme.colors.gray[0],
      },
      main: {
        padding: '32px',
      },
    })}
  >
    {children}
  </AppShell>
);

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MainLayout;
