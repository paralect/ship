import React from 'react';
import PropTypes from 'prop-types';
import NextLink from 'next/link';

const Link = props => (
  <NextLink {...props}>
    <a href={props.href}> {props.children}</a>
  </NextLink>
);

Link.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Link;
