import React from 'react';
import Loadable from 'react-loadable';

import { LoadingAsync } from 'components/common/loading';

const LoadableComponent = Loadable({
  loader: () => import('./index'),
  loading: LoadingAsync,
  render(loaded, props) {
    const LoadedComponent = loaded.default;
    return <LoadedComponent {...props} />;
  },
});

export default LoadableComponent;
