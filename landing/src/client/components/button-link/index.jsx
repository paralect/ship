import React from 'react';
import PropTypes from 'prop-types';

import Link from '~/components/link';
import Button from '~/components/button';

import styles from './styles.pcss';

const ButtonLink = ({
  href,
  children,
  prefetch,
  ...props
}) => {
  return (
    <Button {...props}>
      <Link href={href} className={styles.link} prefetch={prefetch}>
        {children}
      </Link>
    </Button>
  );
};

ButtonLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  prefetch: PropTypes.bool,
};

ButtonLink.defaultProps = {
  prefetch: false,
};

export default ButtonLink;
