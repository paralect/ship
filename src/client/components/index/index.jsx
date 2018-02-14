import React from 'react';

import { Link } from 'components/common/button';
import './index.styles.pcss';

export default class Index extends React.Component {
  render() {
    return (
      <div>
        <h1>Index</h1>
        <Link to="/profile" text="Edit Profile" tabIndex={0} />
      </div>
    );
  }
}
