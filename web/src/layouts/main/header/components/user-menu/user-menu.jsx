import React from 'react';
import cn from 'classnames';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { routes } from 'routes';

import { userActions } from 'resources/user/user.slice';

import styles from './user-menu.styles.pcss';

const linksList = [
  {
    label: 'Profile',
    to: routes.profile.url(),
  },
];

function UserMenu() {
  const dispatch = useDispatch();
  const history = useHistory();

  const [isOpen, setIsOpen] = React.useState(false);
  function toggleIsOpen() {
    setIsOpen((v) => !v);
  }

  const menu = React.useRef();
  React.useEffect(() => {
    function onDocumentClick(event) {
      if (menu.current && menu.current.contains(event.target)) return;
      setIsOpen(false);
    }
    document.addEventListener('click', onDocumentClick);
    return () => document.removeEventListener('click', onDocumentClick);
  }, []);

  async function logout() {
    await dispatch(userActions.signOut());
    history.push(routes.signIn.path);
  }

  return (
    <div className={styles.container}>
      <button
        type="button"
        onClick={toggleIsOpen}
        ref={menu}
        className={styles.button}
      >
        <span role="img" aria-label="user">👤</span>
      </button>

      <ul
        className={cn({
          [styles.menu]: true,
          [styles.menu_open]: isOpen,
        })}
      >
        {linksList.map((link) => (
          <li key={link.label}>
            <Link to={link.to} className={styles.menu_link}>
              {link.label}
            </Link>
          </li>
        ))}
        <li>
          <button type="button" className={styles.menu_link} onClick={logout}>
            Log Out
          </button>
        </li>
      </ul>
    </div>
  );
}

export default React.memo(UserMenu);
