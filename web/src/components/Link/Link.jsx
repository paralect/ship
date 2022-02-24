import { memo } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import NextLink from 'next/link';

import { ArrowLeftIcon } from 'public/icons';

import styles from './Link.module.css';

const sizes = {
  l: 'l',
  m: 'm',
  s: 's',
};

const Link = ({
  type, children, href, size, withIcon, disabled,
  inNewTab, withoutUnderline, className,
}) => {
  switch (type) {
    case 'router':
      return (
        <NextLink href={href}>
          <a
            className={cn({
              [styles.disabled]: disabled,
              [styles.withoutUnderline]: withoutUnderline,
            }, styles[size], styles.link, className)}
          >
            {withIcon && <ArrowLeftIcon className={styles.icon} />}
            <span className={styles.text}>{children}</span>
          </a>
        </NextLink>
      );

    case 'url':
      return (
        <a
          href={href}
          target={inNewTab ? '_blank' : '_self'}
          rel="noreferrer"
          className={cn({
            [styles.disabled]: disabled,
            [styles.withoutUnderline]: withoutUnderline,
          }, styles[size], styles.link, className)}
        >
          {withIcon && <ArrowLeftIcon className={styles.icon} />}
          <span className={styles.text}>{children}</span>
        </a>
      );
    default:
      return null;
  }
};

Link.propTypes = {
  type: PropTypes.string,
  children: PropTypes.node.isRequired,
  href: PropTypes.string,
  size: PropTypes.oneOf(Object.values(sizes)),
  withIcon: PropTypes.bool,
  inNewTab: PropTypes.bool,
  withoutUnderline: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

Link.defaultProps = {
  type: 'url',
  href: null,
  size: sizes.m,
  withIcon: false,
  inNewTab: false,
  withoutUnderline: false,
  disabled: false,
  className: null,
};

export default memo(Link);
