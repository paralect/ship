import React, { useState, useRef, useEffect } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

import { ArrowDownIcon } from 'public/icons';

import Button from 'components/Button';

import { useOutsideClick } from 'hooks';

import styles from './ComboButton.module.css';

const types = {
  primary: 'primary',
  secondary: 'secondary',
  text: 'text',
};

const sizes = {
  l: 'l',
  m: 'm',
  s: 's',
};

const ComboButton = ({
  children, options, size, type, ...props
}) => {
  const containerRef = useRef();
  const menuRef = useRef();
  const [isMenuOpened, setIsMenuOpened] = useState(false);

  useEffect(() => {
    menuRef.current.style.width = 'auto';
    if (containerRef.current.offsetWidth >= menuRef.current.offsetWidth) {
      menuRef.current.style.width = `${containerRef.current.offsetWidth}px`;
    }
  }, [containerRef.current?.offsetWidth]);

  const handleOutsideClick = () => setIsMenuOpened(false);

  const handleButtonClick = () => setIsMenuOpened((prev) => !prev);

  useOutsideClick(containerRef, handleOutsideClick);

  return (
    <div ref={containerRef} className={cn(styles.container, styles[size])}>
      <Button {...props} size={size} type={type} onClick={handleButtonClick}>
        {children}
        <ArrowDownIcon
          className={cn({
            [styles.isOpen]: isMenuOpened,
          }, styles.icon, styles[type])}
        />
      </Button>
      <div
        className={cn({
          [styles.isOpen]: isMenuOpened,
        }, styles.menuContainer)}
        ref={menuRef}
      >
        <div className={styles.menu}>
          {options.map(({ label, onClick }) => (
            <button
              type="button"
              key={label}
              className={styles.option}
              onClick={(e) => {
                onClick(e);
                setIsMenuOpened(false);
              }}
            >
              {typeof label === 'function' ? label() : label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

ComboButton.propTypes = {
  children: PropTypes.node.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    icon: PropTypes.func,
    handler: PropTypes.func,
    label: PropTypes.string.isRequired,
  })).isRequired,
  size: PropTypes.oneOf(Object.values(sizes)),
  type: PropTypes.oneOf(Object.values(types)),
};

ComboButton.defaultProps = {
  size: sizes.m,
  type: types.primary,
};

export default React.memo(ComboButton);
