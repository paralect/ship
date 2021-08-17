import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

import Icon from 'components/icon';

import styles from './button-link.styles.pcss';

function ButtonLink({
  href, text, disabled, className, icon, inNewTab,
}) {
  return (
    <a
      href={href}
      target={inNewTab && '_blank'}
      rel="noreferrer"
      className={cn({
        [styles.disabled]: disabled,
      }, styles.link, className)}
    >
      <div className={styles.value}>
        {text}
        {icon && <Icon icon={icon} />}
      </div>
    </a>
  );
}

ButtonLink.propTypes = {
  text: PropTypes.string.isRequired,
  className: PropTypes.string,
  icon: PropTypes.string,
  disabled: PropTypes.bool,
  inNewTab: PropTypes.bool,
  href: PropTypes.string,
};

ButtonLink.defaultProps = {
  className: null,
  href: '',
  disabled: false,
  inNewTab: true,
  icon: null,
};

export default React.memo(ButtonLink);
