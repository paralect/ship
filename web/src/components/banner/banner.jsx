import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';

import Icon from 'components/icon';
import IconButton from 'components/icon-button';
import Button from 'components/button';

import styles from './banner.styles.pcss';

function getIconProps(type) {
  switch (type) {
    case 'success':
      return {
        icon: 'roundCheck',
        color: '#FFF',
      };
    case 'warning':
      return {
        icon: 'roundWarning',
        color: '#000',
      };
    case 'error':
      return {
        icon: 'roundError',
        color: '#FFF',
      };
    case 'info':
      return {
        icon: 'roundInfo',
        color: '#FFF',
      };
    default:
      return {};
  }
}

const Banner = ({
  onButtonClick, onClose, type, text, buttonText,
}) => {
  const iconProps = getIconProps(type);
  return (
    <div
      className={cn(styles.banner, styles[type])}
    >
      <div className={styles.left}>
        <Icon
          icon={iconProps.icon}
          color={iconProps.color}
          noWrapper
        />
        <span>{text}</span>
      </div>
      <div className={styles.right}>
        {!!buttonText && (
          <Button
            onClick={onButtonClick}
            className={cn(styles.button, styles[type])}
          >
            {buttonText}
          </Button>
        )}
        <IconButton
          icon="close"
          color={iconProps.color}
          onClick={onClose}
        />
      </div>
    </div>
  );
};

Banner.propTypes = {
  text: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  type: PropTypes.string,
  buttonText: PropTypes.string,
  onButtonClick: PropTypes.func,
};

Banner.defaultProps = {
  type: 'info',
  buttonText: null,
  onButtonClick: noop,
};

export default React.memo(Banner);
