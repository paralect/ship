// @flow

import React, { Component } from 'react';
import type { Node } from 'react';
import classnames from 'classnames';

import _uniq from 'lodash/uniq';
import _omit from 'lodash/omit';

import styles from './input.styles.pcss';

type InputType = 'text' | 'search' | 'email' | 'number' | 'password' | 'url';

type PropsType = {
  onChange: (value: string) => void,
  value: string,
  className?: string,
  type: InputType,
  errors: Array<string>,
};

export default class Input extends Component<PropsType> {
  static defaultProps = {
    className: '',
    type: 'text',
    errors: [],
  };

  onChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    const { onChange } = this.props;
    onChange(e.target.value);
  };

  errors(): Node {
    const { errors } = this.props;
    if (!errors.length) {
      return null;
    }

    return (
      <div className={styles.errors}>
        {_uniq(errors).join(', ')}
      </div>
    );
  }

  render(): Node {
    const { className, errors } = this.props;
    const props = _omit(this.props, ['className', 'errors', 'onChange']);

    return (
      <div>
        <input
          className={classnames(styles.input, className, {
            [styles.error]: errors.length,
          })}
          onChange={this.onChange}
          {...props}
        />

        {this.errors()}
      </div>
    );
  }
}
