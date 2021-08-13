import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import styles from './icon.styles.pcss';
import IMAGES from './icons';

const Icon = ({ iconLabel, className, noWrapper }) => {
  const IconComponent = IMAGES[iconLabel] || IMAGES.arrowRight;

  return (
    <div className={cn(!noWrapper && styles.iconWrapper, className)}>
      <IconComponent />
    </div>
  );
};

Icon.propTypes = {
  iconLabel: PropTypes.string,
  noWrapper: PropTypes.bool,
  className: PropTypes.string,
};

Icon.defaultProps = {
  iconLabel: 'arrowRight',
  noWrapper: false,
  className: null,
};

export default Icon;
