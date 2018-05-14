import React from 'react';
import PropTypes from 'prop-types';

import { states } from '~/constants';
import Background from '~/components/background';

import Header from '../header';

import styles from './styles.pcss';

const HeaderContent = ({ children, state }) => {
  return (
    <div className={styles.headerContent}>
      <Background state={state} />

      <Header state={state} />
      {children}
    </div>
  );
};

HeaderContent.propTypes = {
  children: PropTypes.node.isRequired,
  state: PropTypes.string,
};

HeaderContent.defaultProps = {
  state: states.purple,
};

export default HeaderContent;
