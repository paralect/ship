// @flow

import React from 'react';
import Loadable from 'react-loadable';

import { LoadingAsync } from 'components/common/loading';

/* eslint-disable flowtype/no-weak-types */

type EsModuleType = {
  default: React$ComponentType<*>,
};

const LoadableComponent = Loadable({
  loader: (): Promise<EsModuleType> => import('./index'),
  loading: LoadingAsync,
  render(loaded: EsModuleType, props: any): React$Node {
    const LoadedComponent: React$ComponentType<*> = loaded.default;
    return <LoadedComponent {...props} />;
  },
});

export default LoadableComponent;
