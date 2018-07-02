import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Link from '~/components/link';
import Button, { sizes } from '~/components/button';

import styles from './styles.pcss';

const ButtonLink = ({
  href,
  children,
  prefetch,
  className,
  ...props
}) => {
  return (
    <Button
      {...props}
      className={classnames(styles.button, className)}
    >
      <Link
        href={href}
        className={classnames(styles.link, styles[props.size])}
        prefetch={prefetch}
      >
        {children}
      </Link>
    </Button>
  );
};

ButtonLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  prefetch: PropTypes.bool,
  className: PropTypes.string,
  size: PropTypes.string,
};

ButtonLink.defaultProps = {
  prefetch: false,
  className: '',
  size: sizes.medium,
};

export default ButtonLink;
