import {
  useCallback, useEffect, useRef, useState,
} from 'react';
import cn from 'classnames';
import { useRouter } from 'next/router';

import * as routes from 'routes';
import { useOutsideClick } from 'hooks';
import { Avatar } from 'components';
import { userApi } from 'resources/user';
import { accountApi } from 'resources/account';

import styles from './styles.module.css';

const UserMenu = () => {
  const router = useRouter();

  const { data: user } = userApi.useGetCurrent();
  const { mutate: signOut } = accountApi.useSignOut();

  const avatarRef = useRef();

  const [isMenuOpened, setIsMenuOpened] = useState(false);

  const onSettingsClick = useCallback(async () => {
    await router.push(routes.path.profile);
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
          onClick={() => router.push(routes.path.profile)}
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
          onClick={() => signOut()}
          className={styles.menuButton}
        >
          Log out
        </button>
      </div>
    </div>
  );
};

export default UserMenu;
