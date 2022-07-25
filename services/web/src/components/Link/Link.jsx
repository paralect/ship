import { memo } from 'react';
import PropTypes from 'prop-types';
import NextLink from 'next/link';
import { Anchor } from '@mantine/core';

import styles from './styles';

const Link = ({
  type,
  children,
  href,
  size,
  disabled,
  inNewTab,
  underline,
  icon,
  inherit,
  align,
}) => {
  switch (type) {
    case 'router':
      return (
        <NextLink href={href} passHref>
          <Anchor
            component="a"
            size={size}
            inherit={inherit}
            underline={underline}
            sx={(theme) => styles(theme, disabled)}
            align={align}
          >
            {icon}
            {children}
          </Anchor>
        </NextLink>
      );

    case 'url':
      return (
        <Anchor
          href={href}
          target={inNewTab ? '_blank' : '_self'}
          rel="noreferrer"
          size={size}
          inherit={inherit}
          underline={underline}
          sx={(theme) => styles(theme, disabled)}
          align={align}
        >
          {icon}
          {children}
        </Anchor>
      );
    default:
      return null;
  }
};

Link.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.string,
  href: PropTypes.string,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  align: PropTypes.oneOf(['left', 'center', 'right', 'justify']),
  icon: PropTypes.node,
  inNewTab: PropTypes.bool,
  underline: PropTypes.bool,
  inherit: PropTypes.bool,
  disabled: PropTypes.bool,
};

Link.defaultProps = {
  type: 'url',
  href: '#',
  size: 'md',
  icon: null,
  inNewTab: false,
  underline: true,
  disabled: false,
  inherit: false,
  align: 'left',
};

export default memo(Link);
