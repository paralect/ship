import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Layout from './components/layout';

const routes = () => (
  <Switch>
    <Route path="/" component={Layout} />
  </Switch>
);

export default routes;
