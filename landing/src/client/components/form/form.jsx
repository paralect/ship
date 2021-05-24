import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './form.styles.pcss';

const Form = ({ children, className, ...props }) => {
  return (
    <form
      className={classnames(styles.form, className)}
      {...props /* eslint-disable-line react/jsx-props-no-spreading */}
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
