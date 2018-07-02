// @flow

import React from 'react';
import type { Node } from 'react';
import classnames from 'classnames';

import styles from './row.styles.pcss';

type PropsType = {
  children: Node,
  className?: string,
};

const Row = ({ children, className }: PropsType): Node => (
  <div className={classnames(styles.row, className)}>
    {children}
  </div>
);

Row.defaultProps = {
  className: '',
};

export default Row;
