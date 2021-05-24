import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './form.styles.pcss';

const Form = ({ className, children }) => {
  return (
    <div className={classnames(styles.form, className)}>
      {children}
    </div>
  );
};

Form.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Form.defaultProps = {
  className: '',
};

export default Form;
