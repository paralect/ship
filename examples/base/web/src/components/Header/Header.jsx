import { memo } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

import Button from 'components/Button/Button';
import Avatar from 'components/Avatar/Avatar';
import ButtonMenu from 'components/ComboButton/ComboButton';

import styles from './Header.module.css';

const Header = ({
  Icon, menu, avatarSrc, fullName, className,
}) => (
  <div className={cn(styles.header, className)}>
    <div className={styles.panel}>
      <Icon />
      {menu && (
      <div className={styles.menu}>
        {menu.map((item) => {
          const {
            handler, icon, label, options,
          } = item;

          if (options) {
            return (
              <ButtonMenu
                type="text"
                className={styles.menuItem}
                options={options}
              >
                {icon()}
                {label}
              </ButtonMenu>
            );
          }
          return (
            <Button
              key={label}
              onClick={handler}
              type="text"
              className={styles.menuItem}
            >
              {icon()}
              {label}
            </Button>
          );
        })}
      </div>
      )}
    </div>
    <div className={styles.panel}>
      <Button type="text">Button</Button>
      <Button>Button</Button>
      {avatarSrc && fullName && <Avatar fullName={fullName} />}
    </div>
  </div>
);

Header.propTypes = {
  Icon: PropTypes.elementType,
  fullName: PropTypes.string,
  avatarSrc: PropTypes.string,
  className: PropTypes.string,
  menu: PropTypes.arrayOf(PropTypes.shape({
    handler: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.shape({
      handler: PropTypes.func.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.func,
    })),
  })).isRequired,
};

Header.defaultProps = {
  Icon: () => null,
  avatarSrc: null,
  fullName: null,
  className: null,
};

export default memo(Header);
