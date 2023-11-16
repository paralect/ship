import { FC, memo, ReactNode } from 'react';
import NextLink from 'next/link';
import { Anchor } from '@mantine/core';
import cx from 'clsx';

import classes from './Link.module.css';

interface LinkProps {
  children: ReactNode;
  type?: 'url' | 'router';
  href?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'left' | 'center' | 'right' | 'justify';
  icon?: ReactNode;
  inNewTab?: boolean;
  underline?: boolean;
  inherit?: boolean;
  disabled?: boolean;
}

const Link: FC<LinkProps> = ({
  type = 'url',
  children,
  href = '#',
  size = 'md',
  disabled,
  inNewTab,
  underline = true,
  icon,
  inherit,
  align = 'left',
}) => {
  switch (type) {
    case 'router':
      return (
        <NextLink
          className={cx({ [classes.nextLinkUnderlineNone]: !underline })}
          href={href}
          passHref
        >
          <Anchor
            className={cx(classes.link, {
              [classes.disabled]: disabled,
            })}
            size={size}
            inherit={inherit}
            underline={underline ? 'always' : 'never'}
            ta={align}
          >
            {icon}
            {children}
          </Anchor>
        </NextLink>
      );

    case 'url':
      return (
        <Anchor
          className={cx(classes.link, {
            [classes.disabled]: disabled,
          })}
          href={href}
          target={inNewTab ? '_blank' : '_self'}
          rel="noreferrer"
          size={size}
          inherit={inherit}
          underline={underline ? 'always' : 'never'}
          ta={align}
        >
          {icon}
          {children}
        </Anchor>
      );
    default:
      return null;
  }
};

export default memo(Link);
