import React, { useState, useRef } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

import Button from 'components/button';
import Icon from 'components/icon';
import { useOutsideClick } from 'hooks/useOutsideClick';

import styles from './button-menu.styles.pcss';

const types = {
  primary: 'primary',
  secondary: 'secondary',
  text: 'text',
};

const sizes = {
  m: 'm',
  s: 's',
};

function ButtonMenu({
  options, ...props
}) {
  const ref = useRef();
  const [isMenuOpened, setIsMenuOpened] = useState(false);

  const handleOutsideClick = () => setIsMenuOpened(false);

  const handleButtonClick = () => setIsMenuOpened(!isMenuOpened);

  useOutsideClick(ref, handleOutsideClick);

  return (
    <div ref={ref} className={styles.root}>
      <Button {...props} onClick={handleButtonClick}>
        Button
        <Icon
          className={cn({
            [styles.icon]: true,
            [styles.opened]: isMenuOpened,
          })}
          iconLabel="arrowDown"
        />
      </Button>
      {isMenuOpened && options && options.length > 0
        && (
          <div className={styles.menu}>
            {options.map(({
              label, handler, icon: OptionIcon,
            }) => (
              <button
                type="button"
                key={label}
                className={styles.option}
                onClick={handler}
              >
                {OptionIcon && <OptionIcon />}
                {label}
              </button>
            ))}
          </div>
        )}
    </div>
  );
}

ButtonMenu.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(Object.values(types)),
  size: PropTypes.oneOf(Object.values(sizes)),
  options: PropTypes.arrayOf(PropTypes.shape({
    icon: PropTypes.func,
    handler: PropTypes.func,
    label: PropTypes.string.isRequired,
  })).isRequired,
  className: PropTypes.string,
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
};

ButtonMenu.defaultProps = {
  type: types.primary,
  size: sizes.m,
  isLoading: false,
  className: null,
  disabled: false,
};

export default React.memo(ButtonMenu);
