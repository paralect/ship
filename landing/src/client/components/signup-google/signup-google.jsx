import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import getConfig from 'next/config';

import classnames from 'classnames';
import styles from './signup-google.styles.pcss';

const {
  publicRuntimeConfig: { apiUrl },
} = getConfig();


export default class SignUpGoogle extends PureComponent {
  render() {
    const { className } = this.props;

    return (
      <div className={classnames(styles.container, className.container)}>
        <a
          href={`${apiUrl}/account/signin/google/auth`}
          className={styles.signup}
        >
          <span className={styles.icon} />
          <span className={styles.label}>Continue with Google</span>
        </a>
      </div>
    );
  }
}

SignUpGoogle.propTypes = {
  className: PropTypes.shape(),
};

SignUpGoogle.defaultProps = {
  className: {},
};
