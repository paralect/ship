import Logo from 'public/images/logo.svg';

import { routes } from 'config';

import Link from 'components/Link';

import UserMenu from './components/UserMenu';

import styles from './styles.module.css';

const Header = () => (
  <header className={styles.header}>
    <Link type="router" href={routes.path.home} withoutUnderline>
      <Logo className={styles.logo} />
    </Link>

    <div className={styles.menu}>
      <UserMenu />
    </div>
  </header>
);

export default Header;
