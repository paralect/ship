import PropTypes from 'prop-types';

import Header from './Header';
import Footer from './Footer';

import styles from './styles.module.css';

const MainLayout = ({ children }) => (
  <div className={styles.wrapper}>
    <Header />
    <main className={styles.content}>
      {children}
    </main>
    <Footer />
  </div>
);

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MainLayout;
