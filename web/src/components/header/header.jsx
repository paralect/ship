import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

import Icon from 'components/icon';
import Button from 'components/button';
import Avatar from 'components/avatar';
import ButtonMenu from 'components/button-menu';

import styles from './header.styles.pcss';

function Header({
  icon, menu, avatarSrc, fullName, className,
}) {
  return (
    <div className={cn(styles.header, className)}>
      <div className={styles.panel}>
        <Icon icon={icon} noWrapper />
        {menu && (
          <div className={styles.menu}>
            {menu.map((item) => {
              const {
                handler, icon: itemIcon, label, options,
              } = item;

              if (options) {
                return (
                  <ButtonMenu
                    type="text"
                    className={styles.menuItem}
                    options={options}
                  >
                    <Icon icon={itemIcon} />
                    {label}
                  </ButtonMenu>
                );
              }
              return (
                <Button
                  key={label + itemIcon}
                  onClick={handler}
                  type="text"
                  className={styles.menuItem}
                >
                  <Icon icon={itemIcon} />
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
}

Header.propTypes = {
  icon: PropTypes.string,
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
  icon: 'shipLogo',
  avatarSrc: null,
  fullName: null,
  className: null,
};

export default React.memo(Header);
