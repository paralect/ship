import React, { memo } from 'react';
import ReactModal from 'react-modal';
import PropTypes from 'prop-types';

import Button from 'components/button';
import IconButton from 'components/icon-button';

import styles from './modal.styles.pcss';

function Modal({
  children, title, subtitle, onSubmit, onCancel, noCancel, noSubmit, open, onClose,
  cancelButtonTitle, submitButtonTitle,
}) {
  return (
    <ReactModal
      isOpen={open}
      shouldFocusAfterRender
      shouldCloseOnOverlayClick
      shouldCloseOnEsc
      className={styles.modal}
      onRequestClose={onClose || onCancel}
      overlayClassName={styles.overlay}
    >
      <div className={styles.header}>
        <div className={styles.headerText}>
          {title && (
            <div className={styles.title}>
              {title}
            </div>
          )}
          {subtitle && (
            <div className={styles.subtitle}>
              {subtitle}
            </div>
          )}
        </div>
        <IconButton icon="close" onClick={onClose} />
      </div>
      <div className={styles.content}>
        {children}
      </div>
      <div className={styles.footer}>
        {!noSubmit && (
          <Button
            className={styles.button}
            onClick={onSubmit}
          >
            {submitButtonTitle}
          </Button>
        )}
        {!noCancel && (
          <Button
            className={styles.button}
            onClick={onCancel || onClose}
            type="text"
          >
            {cancelButtonTitle}
          </Button>
        )}
      </div>
    </ReactModal>
  );
}

Modal.propTypes = {
  cancelButtonTitle: PropTypes.string,
  submitButtonTitle: PropTypes.string,
  subtitle: PropTypes.string,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  noCancel: PropTypes.bool,
  noSubmit: PropTypes.bool,
  children: PropTypes.node,
  onClose: PropTypes.func,
  title: PropTypes.string,
  open: PropTypes.bool,
};

Modal.defaultProps = {
  cancelButtonTitle: 'Cancel',
  submitButtonTitle: 'Submit',
  noCancel: false,
  noSubmit: false,
  subtitle: null,
  onSubmit: null,
  onCancel: null,
  children: null,
  onClose: null,
  title: null,
  open: false,
};

export default memo(Modal);
