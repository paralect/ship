// @flow

import React from 'react';
import type { Node, ComponentType } from 'react';
import Loadable from 'react-loadable';

import { LoadingAsync } from 'components/common/loading';

/* eslint-disable flowtype/no-weak-types */

type EsModuleType = {
  default: ComponentType<any>,
};

const LoadableComponent = Loadable({
  loader: (): Promise<EsModuleType> => import('./index'),
  loading: LoadingAsync,
  render(loaded: EsModuleType, props: any): Node {
    const LoadedComponent: ComponentType<any> = loaded.default;
    return <LoadedComponent {...props} />;
  },
});

export default LoadableComponent;
