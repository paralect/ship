import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { withRouter } from 'next/router';

import Header from '~/components/header';

import styles from './styles.css';

const Layout = ({ children, router }) => {
  const secondary = router.pathname.includes('/signup');

  return (
    <div className={classnames([styles.wrap], {
      [styles.secondary]: secondary,
    })}
    >
      <Header secondary={secondary} />
      { children }
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  router: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
};

export default withRouter(Layout);
