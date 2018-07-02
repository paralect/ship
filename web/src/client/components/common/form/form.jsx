// @flow

import React from 'react';
import type { Node } from 'react';
import classnames from 'classnames';

import styles from './form.styles.pcss';

type PropsType = {
  children: Node,
  className?: string,
};

const Form = ({ className, children }: PropsType): Node => {
  return (
    <div className={classnames(styles.form, className)}>
      {children}
    </div>
  );
};

Form.defaultProps = {
  className: '',
};

export default Form;
