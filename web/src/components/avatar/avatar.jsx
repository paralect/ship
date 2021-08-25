import React, { memo } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

import styles from './avatar.styles.pcss';

const sizes = {
  xl: styles.xl,
  l: styles.l,
  m: styles.m,
  s: styles.s,
  xs: styles.xs,
};

function Avatar({ size, src, fullName }) {
  const convertedName = fullName.split(' ').slice(0, 2).map((el) => el[0]);

  return (
    <div className={cn(styles.avatarBlock, styles[size])}>
      {src
        ? <img className={styles.avatarImage} src={src} alt="Person Avatar" />
        : <span className={styles.avatarName}>{convertedName}</span>}
    </div>
  );
}

Avatar.propTypes = {
  size: PropTypes.oneOf(Object.keys(sizes)),
  fullName: PropTypes.string,
  src: PropTypes.string,
};

Avatar.defaultProps = {
  size: 'm',
  src: '',
  fullName: '',
};

export default memo(Avatar);
