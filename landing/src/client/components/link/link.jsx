import React from 'react';
import PropTypes from 'prop-types';
import NextLink from 'next/link';

import _omit from 'lodash/omit';

const Link = props => (
  <NextLink {..._omit(props, ['className'])}>
    <a
      href={props.href}
      className={props.className}
    >
      {props.children}
    </a>
  </NextLink>
);

Link.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Link.defaultProps = {
  className: '',
};

export default Link;
