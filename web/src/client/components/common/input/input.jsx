import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import _uniq from 'lodash/uniq';
import _omit from 'lodash/omit';

import styles from './input.styles';

export default class Input extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    className: PropTypes.string,
    type: PropTypes.oneOf(['text', 'search', 'email', 'number', 'password', 'url']),
    errors: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    className: null,
    type: 'text',
    errors: [],
  };

  onChange = (e) => {
    this.props.onChange(e.target.value);
  };

  errors() {
    if (!this.props.errors.length) {
      return null;
    }

    return <div className={styles.errors}>{_uniq(this.props.errors).join(', ')}</div>;
  }

  render() {
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
