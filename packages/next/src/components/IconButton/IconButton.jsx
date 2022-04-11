import { memo } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import styles from './IconButton.module.css';

const IconButton = ({
  Icon, disabled, onClick, className, size,
}) => (
  <button
    type="button"
    className={cn(styles.iconButton, className, styles[size])}
    disabled={disabled}
    onClick={onClick}
  >
    <Icon />
  </button>
);

IconButton.propTypes = {
  Icon: PropTypes.elementType.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
  size: PropTypes.string,
};

IconButton.defaultProps = {
  disabled: false,
  className: null,
  onClick: null,
  size: 'm',
};

export default memo(IconButton);
