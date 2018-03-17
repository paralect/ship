// @flow

import React, { Component } from 'react';
import type { Node } from 'react';
import classnames from 'classnames';

import styles from './button.styles.pcss';

const colors = {
  green: 'green',
  blue: 'blue',
  red: 'red',
};

type ColorType = 'green' | 'blue' | 'red';

type PropsType = {
  children: Node,
  onClick?: (e: SyntheticEvent<HTMLDivElement>) => Promise<*>
    | (e: SyntheticEvent<HTMLDivElement>) => void,
  onKeyDown?: (e: SyntheticKeyboardEvent<HTMLDivElement>) => Promise<*>
    | (e: SyntheticKeyboardEvent<HTMLDivElement>) => void,
  tabIndex?: string | number,
  color?: ColorType,
  className?: string,
};

class Button extends Component<PropsType> {
  static defaultProps = {
    onClick: undefined,
    onKeyDown: undefined,
    tabIndex: 0,
    color: colors.blue,
    className: '',
  };

  onEnterDown = (e: SyntheticKeyboardEvent<HTMLDivElement>) => {
    if (e.keyCode === 13 && this.props.onClick) {
      this.props.onClick(e);
    }
  };

  render(): Node {
    const {
      children, tabIndex, onClick, onKeyDown, color, className,
    } = this.props;

    return (
      <div
        className={classnames(styles.button, styles[color], className)}
        role="button"
        tabIndex={tabIndex}
        onClick={onClick}
        onKeyDown={onKeyDown || this.onEnterDown}
      >
        {children}
      </div>
    );
  }
}

export default Button;
export { colors };
