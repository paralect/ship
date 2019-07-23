import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { states } from '~/constants';

import HeaderContent from './components/header-content';
import Content from './components/content';
import Footer from './components/footer';

import styles from './main.styles.pcss';

const Main = ({ children, className, state }) => {
  return (
    <div className={classnames(styles.wrap, className)}>
      {children}

      <Footer state={state} />
    </div>
  );
};

Main.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  state: PropTypes.string,
};

Main.defaultProps = {
  className: '',
  state: states.purple,
};

Main.HeaderContent = HeaderContent;
Main.Content = Content;

export default Main;
