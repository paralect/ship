// @flow

import React from 'react';
import type { Node } from 'react';
import classnames from 'classnames';

import styles from './form.styles.pcss';

type PropsType = {
  children: Node,
  className?: string,
};

const Form = (props: PropsType): Node => (
  <div className={classnames(styles.form, props.className)}>{props.children}</div>
);

Form.defaultProps = {
  className: '',
};

export default Form;
