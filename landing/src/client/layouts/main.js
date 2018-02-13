import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { withRouter } from 'next/router';

import Header from '~/components/header';

const Layout = ({ children, router }) => {
  const secondary = router.pathname.includes('/signup');

  return (
    <div className={classnames('wrap', { secondary })}>
      <style jsx>{`
          .wrap {
            display: flex;
            flex-direction: column;
            min-height: 100vh;

            background-color: var(--color-brand);
            box-shadow: 0 7px 30px 3px rgba(94,96,186,.35);
        
            &.secondary {
              background-color: var(--color-secondary);
            }
          }
        `}</style>

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
