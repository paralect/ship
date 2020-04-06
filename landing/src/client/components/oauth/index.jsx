import React from 'react';
import PropTypes from 'prop-types';
import getConfig from 'next/config';

import styles from './styles.pcss';

const { publicRuntimeConfig: { apiUrl } } = getConfig();


function OAuth(props) {
  const { name } = props;
  const nameCapitalized = name.charAt(0).toUpperCase() + name.slice(1);

  return (
    <div className={styles.container}>
      <a
        href={`${apiUrl}/account/auth/${name}`}
        className={styles.signup}
      >
        <span className={styles[`icon--${name}`]} />
        <span className={styles.label}>{`Continue with ${nameCapitalized}`}</span>
      </a>
    </div>
  );
}

OAuth.propTypes = {
  name: PropTypes.string.isRequired,
};

export default OAuth;
