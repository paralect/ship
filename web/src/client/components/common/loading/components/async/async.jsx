import React from 'react';
import PropTypes from 'prop-types';

import Loading from 'components/common/loading/loading';

const AsyncLoading = ({ error, pastDelay }) => {
  if (error) {
    return (
      <div>
        {'Error!'}
      </div>
    );
  }
  if (pastDelay) {
    return <Loading />;
  }
  return null;
};

AsyncLoading.propTypes = {
  error: PropTypes.shape({
    name: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    stack: PropTypes.string,
  }),
  pastDelay: PropTypes.bool.isRequired,
};

AsyncLoading.defaultProps = {
  error: null,
};

export default AsyncLoading;
