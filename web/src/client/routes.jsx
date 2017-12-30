import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Layout from './components/layout';

// key={Math.random()} - is a workaround for work of the hmr with react-loadable
// https://medium.com/@giang.nguyen.dev/hot-loader-with-react-loadable-c8f70c8ce1a6
const routes = () => (
  <Switch>
    <Route path="/" component={Layout} key={module.hot ? Math.random() : 'layout'} />
  </Switch>
);

export default routes;
