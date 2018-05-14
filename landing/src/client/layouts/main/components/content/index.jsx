import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './styles.pcss';

const Content = ({ children, className }) => {
  return (
    <div className={classnames(styles.content, className)}>
      {children}
    </div>
  );
};

Content.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Content.defaultProps = {
  className: '',
};


export default Content;
