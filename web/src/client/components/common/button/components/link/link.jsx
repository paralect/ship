import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Button from 'components/common/button';

import styles from './link.styles';

const noop = () => {};

class ButtonLink extends Component {
  static propTypes = {
    onClick: PropTypes.func,
    text: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    tabIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  };

  static defaultProps = {
    onClick: noop,
  };

  onKeyDown = (e) => {
    if (e.keyCode === 13 && this.props.onClick) {
      this.props.onClick(e);
    }
  };

  render() {
    const {
      to, text, onClick, tabIndex,
    } = this.props;

    return (
      <Link to={to} className={styles.link}>
        <Button onClick={onClick} onKeyDown={this.onKeyDown} tabIndex={tabIndex}>
          {text}
        </Button>
      </Link>
    );
  }
}

export default ButtonLink;
