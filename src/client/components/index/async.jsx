import React from 'react';
import Loadable from 'react-loadable';

import Loading from 'components/common/loading';

const LoadableComponent = Loadable({
  loader: () => import('./index'),
  loading: Loading,
  render(loaded, props) {
    const LoadedComponent = loaded.default;
    return <LoadedComponent {...props} />;
  },
});

export default LoadableComponent;
