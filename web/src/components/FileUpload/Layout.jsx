import React, { memo } from 'react';

import PropTypes from 'prop-types';
import styles from './FileUpload.module.css';

const Layout = ({
  input, submitButton, previews, dropzoneProps, error,
}) => (
  <div>
    <div {...dropzoneProps}>
      {input}
    </div>
    {error?.message && <div className={styles.errorMessage}>{error.message}</div>}
    {previews.length > 0 && <ul className={styles.fileList}>{previews}</ul>}
    {submitButton}
  </div>
);

Layout.propTypes = {
  input: PropTypes.shape({}),
  submitButton: PropTypes.shape({}),
  previews: PropTypes.arrayOf(PropTypes.object).isRequired,
  dropzoneProps: PropTypes.shape({}).isRequired,
  error: PropTypes.shape({
    message: PropTypes.string,
  }).isRequired,
};

Layout.defaultProps = {
  input: null,
  submitButton: null,
};

export default memo(Layout);
