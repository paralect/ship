import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './styles.pcss';

const Form = ({ children, className, ...props }) => {
  return (
    <form
      className={classnames(styles.form, className)}
      {...props}
    >
      {children}
    </form>
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
