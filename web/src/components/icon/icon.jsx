import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import styles from './icon.styles.pcss';
import IMAGES from './icons';

const Icon = ({ icon, className, noWrapper }) => {
  const IconComponent = IMAGES[icon] || IMAGES.arrowRight;

  return (
    <div className={cn(!noWrapper && styles.iconWrapper, className)}>
      <IconComponent />
    </div>
  );
};

Icon.propTypes = {
  icon: PropTypes.string,
  noWrapper: PropTypes.bool,
  className: PropTypes.string,
};

Icon.defaultProps = {
  icon: 'arrowRight',
  noWrapper: false,
  className: null,
};

export default Icon;
