import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './button.styles.pcss';

const colors = {
  green: 'green',
  blue: 'blue',
  red: 'red',
};

class Button extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
    onKeyDown: PropTypes.func,
    tabIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    color: PropTypes.oneOf([colors.green, colors.blue, colors.red]),
    className: PropTypes.string,
  };

  static defaultProps = {
    onClick: null,
    onKeyDown: null,
    tabIndex: 0,
    color: colors.blue,
    className: null,
  };

  onEnterDown = (e) => {
    if (e.keyCode === 13 && this.props.onClick) {
      this.props.onClick(e);
    }
  };

  render() {
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
