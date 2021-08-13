import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

import Icon from 'components/icon';

import styles from './icon-button.styles.pcss';

function IconButton({
  iconLabel, disabled, className, ...props
}) {
  return (
    <button
      type="button"
      className={cn({
        [styles.disabled]: disabled,
      }, styles.button)}
      {...props}
    >
      <Icon iconLabel={iconLabel} />
    </button>
  );
}

IconButton.propTypes = {
  iconLabel: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

IconButton.defaultProps = {
  iconLabel: 'close',
  className: null,
  disabled: false,
};

export default React.memo(IconButton);
