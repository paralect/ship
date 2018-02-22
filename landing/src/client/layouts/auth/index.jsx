import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Layout from '~/layouts/main';

import styles from './styles.pcss';

const Auth = ({ children, className }) => {
  return (
    <Layout>
      <div className={styles.page}>
        <div className={classnames(styles.panel, className)}>
          {children}
        </div>
      </div>
    </Layout>
  );
};

Auth.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Auth.defaultProps = {
  className: '',
};

export default Auth;
