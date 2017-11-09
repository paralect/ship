import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './input.styles';


export default class Input extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    className: PropTypes.string,
    type: PropTypes.oneOf([
      'text',
      'search',
      'email',
      'number',
      'password',
      'url',
    ]),
  }

  static defaultProps = {
    className: null,
    type: 'text',
  }

  onChange = (e) => {
    this.props.onChange(e.target.value);
  }

  render() {
    const {
      type,
      className,
      value,
    } = this.props;

    return (
      <input
        type={type}
        className={classnames(styles.input, className)}
        onChange={this.onChange}
        value={value}
      />
    );
  }
}
