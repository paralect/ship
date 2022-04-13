import cn from 'classnames';
import PropTypes from 'prop-types';

import Modal from 'components/Modal/Modal';
import Button from 'components/Button/Button';

import createConfirmation from './createConfirmation';
import styles from './Confirmation.module.css';

const Confirmation = ({
  heading, subheading, body, withoutBodyMargins, submitButtonType, submitButtonText,
  cancelButtonType, cancelButtonText, isOpen, onSubmit, onDismiss,
}) => (
  <Modal isOpen={isOpen} onRequestClose={onDismiss}>
    <div className={styles.container}>
      <h3>{heading}</h3>
      {subheading && (
      <div className={styles.subheading}>
        {subheading}
      </div>
      )}
      <div className={cn({
        [styles.withoutMargins]: withoutBodyMargins,
      }, styles.body)}
      >
        {typeof body === 'function' ? body() : body}
      </div>
      <div className={styles.buttonContainer}>
        {cancelButtonText && (
          <Button
            type={cancelButtonType}
            onClick={onDismiss}
          >
            {cancelButtonText}
          </Button>
        )}
        <Button
          type={submitButtonType}
          onClick={onSubmit}
        >
          {submitButtonText}
        </Button>
      </div>
    </div>
  </Modal>
);

Confirmation.propTypes = {
  heading: PropTypes.string.isRequired,
  subheading: PropTypes.string,
  body: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]).isRequired,
  withoutBodyMargins: PropTypes.bool,
  submitButtonType: PropTypes.string,
  submitButtonText: PropTypes.string,
  cancelButtonType: PropTypes.string,
  cancelButtonText: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onDismiss: PropTypes.func.isRequired,
};

Confirmation.defaultProps = {
  subheading: null,
  withoutBodyMargins: false,
  submitButtonType: 'primary',
  submitButtonText: 'Submit',
  cancelButtonType: 'text',
  cancelButtonText: 'Cancel',
};

export default createConfirmation(Confirmation);
