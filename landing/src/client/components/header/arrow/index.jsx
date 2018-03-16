import React from 'react';
import IconBase from 'react-icon-base';

import styles from './styles.pcss';

export default class FaHeart extends React.Component {
  render() {
    return (
      <IconBase width="13" height="10" viewBox="0 0 13 10" style={{ stroke: 'white' }} {...this.props}>
        <path className={styles.arrow} d="M1,5H12" />
        <path className={styles.arrow} d="M7.72,1.006L11.992,5,7.72,8.993" />
      </IconBase>
    );
  }
}
