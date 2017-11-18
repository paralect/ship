import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import FaExclamationCircle from 'react-icons/lib/fa/exclamation-circle';
import FaExclamationTriangle from 'react-icons/lib/fa/exclamation-triangle';
import FaCheckCircle from 'react-icons/lib/fa/check-circle';

import { getToasterMessages } from 'resources/reducer';
import { removeMessage } from './toast.actions';

import styles from './toast.styles.pcss';

const icon = (messageType) => {
  switch (messageType) {
    case 'error':
      return <FaExclamationCircle className={styles.icon} size={25} />;

    case 'warning':
      return <FaExclamationTriangle className={styles.icon} size={25} />;

    case 'success':
      return <FaCheckCircle className={styles.icon} size={25} />;

    default:
      return null;
  }
};

class Toast extends Component {
  static propTypes = {
    messages: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      type: PropTypes.oneOf(['error', 'success', 'warning']),
      text: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
      ]),
      isHTML: PropTypes.bool,
    })).isRequired,
    removeMessage: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.el = document.createElement('div');
    this.el.classList.add(styles.wrap);
  }

  componentDidMount() {
    document.body.appendChild(this.el);
  }

  componentWillUnmount() {
    document.body.removeChild(this.el);
  }

  onMessageClick = id => (e) => {
    this.props.removeMessage(id);
  }

  onMessageKeyDown = id => (e) => {
    if (e.keyCode === 13) {
      this.props.removeMessage(id);
    }
  }

  messagesList() {
    return this.props.messages.map((message, index) => {
      const text = (!message.text || typeof message.text === 'string')
        ? message.text
        : message.text.join(', ');

      return (
        <div
          key={message.id}
          role="button"
          tabIndex={index}
          className={classnames(styles.message, styles[message.type])}
          onClick={this.onMessageClick(message.id)}
          onKeyDown={this.onMessageKeyDown(message.id)}
        >
          {icon(message.type)}
          <div>
            {message.title && <div className={styles.title}>{message.title}</div>}
            <div>{text}</div>
          </div>
        </div>
      );
    });
  }

  render() {
    return ReactDOM.createPortal(
      this.messagesList(),
      this.el,
    );
  }
}

const mapStateToProps = state => ({
  messages: getToasterMessages(state, 'all'),
});

export default connect(mapStateToProps, {
  removeMessage,
})(Toast);
