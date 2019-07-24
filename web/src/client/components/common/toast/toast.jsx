import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import classnames from 'classnames';

import {
  FaExclamationCircle,
  FaExclamationTriangle,
  FaCheckCircle,
} from 'react-icons/fa';

import { getToasterMessages } from 'resources/toast/toast.selectors';
import { removeMessage as removeMessageAction } from 'resources/toast/toast.actions';

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
  constructor(props) {
    super(props);

    this.el = document.createElement('div');
    this.el.classList.add(styles.wrap);
  }

  componentDidMount() {
    if (document.body) {
      document.body.appendChild(this.el);
    }
  }

  componentWillUnmount() {
    if (document.body) {
      document.body.removeChild(this.el);
    }
  }

  onMessageClick = id => () => {
    const { removeMessage } = this.props;
    removeMessage(id);
  };

  onMessageKeyDown = id => (e) => {
    if (e.keyCode === 13) {
      const { removeMessage } = this.props;
      removeMessage(id);
    }
  };

  messagesList() {
    const { messages } = this.props;

    return messages.map((message, index) => {
      const text = !message.text || typeof message.text === 'string'
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
            {
              message.title && (
                <div className={styles.title}>
                  {message.title}
                </div>
              )
            }
            <div>
              {text}
            </div>
          </div>
        </div>
      );
    });
  }

  render() {
    return ReactDOM.createPortal(this.messagesList(), this.el);
  }
}

Toast.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    type: PropTypes.oneOf(['error', 'success', 'warning']),
    text: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    isHTML: PropTypes.bool,
  })).isRequired,
  removeMessage: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  messages: getToasterMessages(state, 'all'),
});

export default connect(mapStateToProps, {
  removeMessage: removeMessageAction,
})(Toast);
