import React from 'react';
import PropTypes from 'prop-types';
import NextLink from 'next/link';

import _omit from 'lodash/omit';

const Link = (props) => {
  const { href, className, children } = props;

  return (
    <NextLink {..._omit(props, ['className']) /* eslint-disable-line react/jsx-props-no-spreading */}>
      <a
        href={href}
        className={className}
      >
        {children}
      </a>
    </NextLink>
  );
};

Link.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Link.defaultProps = {
  className: '',
};

export default Link;
