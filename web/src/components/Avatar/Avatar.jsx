import React, { memo } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

import styles from './Avatar.module.css';

const sizes = {
  xl: 'l',
  l: 'l',
  m: 'm',
  s: 's',
  xs: 'xs',
};

const Avatar = ({
  size, src, fullName, onClick, className,
}) => {
  const convertedName = fullName?.split(' ').slice(0, 2).map((el) => el[0]);

  return (
    <div
      role="presentation"
      className={cn({
        [styles.withAvatar]: src,
      }, styles.avatarBlock, styles[size], className)}
      onClick={onClick}
    >
      {src
        ? <img className={styles.avatarImage} src={src} alt="Person Avatar" />
        : <span className={styles.avatarName}>{convertedName}</span>}
    </div>
  );
};

Avatar.propTypes = {
  size: PropTypes.oneOf(Object.keys(sizes)),
  fullName: PropTypes.string,
  src: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

Avatar.defaultProps = {
  size: sizes.m,
  src: null,
  fullName: null,
  onClick: null,
  className: null,
};

export default memo(Avatar);
