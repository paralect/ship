// @flow

import React, { Component } from 'react';
import type { Node } from 'react';

import { Link } from 'components/common/button';
import './index.styles.pcss';

export default class Index extends Component<*> {
  render(): Node {
    return (
      <div>
        <h1>Index</h1>
        <Link to="/profile" text="Edit Profile" tabIndex={0} />
      </div>
    );
  }
}
