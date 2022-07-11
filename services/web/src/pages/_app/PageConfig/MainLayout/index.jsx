import PropTypes from 'prop-types';
import { AppShell } from '@mantine/core';

import Header from './Header';
import Footer from './Footer';

const MainLayout = ({ children }) => (
  <AppShell
    header={<Header />}
    footer={<Footer />}
  >
    {children}
  </AppShell>
);

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MainLayout;
