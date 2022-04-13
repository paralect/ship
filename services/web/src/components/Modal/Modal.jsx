import { memo } from 'react';
import ReactModal from 'react-modal';
import PropTypes from 'prop-types';
import cn from 'classnames';

import styles from './Modal.module.css';

const Modal = ({ children, isOpen, onRequestClose }) => (
  <ReactModal
    isOpen={isOpen}
    shouldFocusAfterRender
    shouldCloseOnOverlayClick
    shouldCloseOnEsc
    onRequestClose={() => onRequestClose()}
    closeTimeoutMS={300}
    className={styles.modal}
    appElement={document.getElementById('__next')}
    overlayClassName={cn({
      [styles.beforeClose]: !isOpen,
    }, styles.overlay)}
  >
    {children}
  </ReactModal>
);

Modal.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.elementType,
    PropTypes.object,
    PropTypes.node,
  ]).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func,
};

Modal.defaultProps = {
  onRequestClose: null,
};

export default memo(Modal);
