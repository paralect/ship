import PropTypes from 'prop-types';

import * as routes from 'routes';
import ShipLogo from 'public/images/logo.svg';

import Link from 'components/Link';

import styles from './styles.module.css';

const UnauthorizedLayout = ({ children }) => (
  <div className={styles.wrapper}>
    <header className={styles.header}>
      <Link type="router" href={routes.path.home} withoutUnderline>
        <ShipLogo className={styles.logo} />
      </Link>

    </header>
    <main className={styles.content}>
      {children}
    </main>
  </div>
);

UnauthorizedLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default UnauthorizedLayout;
