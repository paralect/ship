import PropTypes from 'prop-types';

import * as routes from 'routes';
import { LogoDarkImage } from 'public/images';
import { Link } from 'components';

import styles from './styles.module.css';

const UnauthorizedLayout = ({ children }) => (
  <div className={styles.wrapper}>
    <header className={styles.header}>
      <Link type="router" href={routes.path.home} withoutUnderline>
        <LogoDarkImage />
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
