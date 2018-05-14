import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { states } from '~/constants';

import styles from './styles.pcss';

const Background = ({ state }) => {
  return (
    <div className={classnames(styles.background, styles[state])} />
  );
};

Background.propTypes = {
  state: PropTypes.string,
};

Background.defaultProps = {
  state: states.purple,
};

export default Background;
