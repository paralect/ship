import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { states } from '~/constants';

import HeaderContent from './components/header-content';
import Content from './components/content';
import Footer from './components/footer';

import styles from './styles.pcss';

const Layout = ({ children, className, state }) => {
  return (
    <div className={classnames(styles.wrap, className)}>
      {children}

      <Footer state={state} />
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  state: PropTypes.string,
};

Layout.defaultProps = {
  className: '',
  state: states.purple,
};

Layout.HeaderContent = HeaderContent;
Layout.Content = Content;

export default Layout;
