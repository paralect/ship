import {
  useCallback, useEffect, useRef, useState,
} from 'react';
import cn from 'classnames';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

import { path } from 'pages/routes';

import { useOutsideClick } from 'hooks/use-outside-click';

import { userActions, userSelectors } from 'resources/user/user.slice';

import Avatar from 'components/Avatar';

import styles from './styles.module.css';

const UserMenu = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const user = useSelector(userSelectors.selectUser);

  const avatarRef = useRef();

  const [isMenuOpened, setIsMenuOpened] = useState(false);

  const onSignOutClick = useCallback(async () => {
    await dispatch(userActions.signOut());
  }, [dispatch]);

  const onSettingsClick = useCallback(async () => {
    await router.push(path.profile);
    setIsMenuOpened((prev) => !prev);
  }, [router]);

  const handleOutsideClick = () => setIsMenuOpened(false);

  const handleAvatarClick = () => setIsMenuOpened((prev) => !prev);

  useOutsideClick(avatarRef, handleOutsideClick);

  useEffect(() => {
    setIsMenuOpened(false);
  }, [router]);

  return (
    <div className={styles.container}>
      <button
        ref={avatarRef}
        type="button"
        className={styles.avatarWrapper}
        onClick={handleAvatarClick}
      >
        <Avatar
          onClick={() => router.push(path.profile)}
          fullName={`${user.firstName} ${user.lastName}`}
          src={user.avatarUrl}
        />
      </button>

      <div className={cn({
        [styles.isOpen]: isMenuOpened,
      }, styles.menu)}
      >
        <button
          type="button"
          className={styles.menuButton}
          onClick={onSettingsClick}
        >
          Profile
        </button>
        <button
          type="button"
          onClick={onSignOutClick}
          className={styles.menuButton}
        >
          Log out
        </button>
      </div>
    </div>
  );
};

export default UserMenu;
