import * as routes from 'routes';
import { Link } from 'components';
import { LogoImage } from 'public/images';

import UserMenu from './components/UserMenu';
import styles from './styles.module.css';

const Header = () => (
  <header className={styles.header}>
    <Link type="router" href={routes.path.home} withoutUnderline>
      <LogoImage />
    </Link>

    <div className={styles.menu}>
      <UserMenu />
    </div>
  </header>
);

export default Header;
