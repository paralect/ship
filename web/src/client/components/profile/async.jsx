// @flow

import React from 'react';
import Loadable from 'react-loadable';

import Loading from 'components/common/loading/async';

/* eslint-disable flowtype/no-weak-types */

type EsModuleType = {
  default: React$ComponentType<any>,
};

const LoadableComponent = Loadable({
  loader: (): Promise<EsModuleType> => import('./index'),
  loading: Loading,
  render(loaded: EsModuleType, props: any): React$Node {
    const LoadedComponent: React$ComponentType<any> = loaded.default;
    return <LoadedComponent {...props} />;
  },
});

export default LoadableComponent;
