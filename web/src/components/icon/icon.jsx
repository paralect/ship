import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import styles from './icon.styles.pcss';
import IMAGES from './icons';

const Icon = ({
  icon, className, noWrapper, color,
}) => {
  const IconComponent = IMAGES[icon] || IMAGES.arrowRight;

  return (
    <div className={cn(!noWrapper && styles.iconWrapper, className, styles.icon)}>
      <IconComponent color={color} />
    </div>
  );
};

Icon.propTypes = {
  icon: PropTypes.string,
  noWrapper: PropTypes.bool,
  className: PropTypes.string,
  color: PropTypes.string,
};

Icon.defaultProps = {
  icon: 'roundError',
  noWrapper: false,
  className: null,
  color: null,
};

export default Icon;
