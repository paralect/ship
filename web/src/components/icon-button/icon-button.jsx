import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

import Icon from 'components/icon';

import styles from './icon-button.styles.pcss';

function IconButton({
  icon, disabled, className, ...props
}) {
  return (
    <button
      type="button"
      className={cn({
        [styles.disabled]: disabled,
      }, styles.button)}
      {...props}
    >
      <Icon icon={icon} />
    </button>
  );
}

IconButton.propTypes = {
  icon: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

IconButton.defaultProps = {
  icon: 'close',
  className: null,
  disabled: false,
};

export default React.memo(IconButton);
