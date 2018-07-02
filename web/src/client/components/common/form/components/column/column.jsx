// @flow

import React from 'react';
import type { Node } from 'react';
import classnames from 'classnames';

import styles from './column.styles.pcss';

type PropsType = {
  children?: Node,
  className?: string,
};

const Column = ({ children, className }: PropsType): Node => (
  <div className={classnames(styles.column, className)}>
    {children}
  </div>
);

Column.defaultProps = {
  className: '',
  children: null,
};

export default Column;
