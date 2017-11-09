import React from 'react';
import IconBase from 'react-icon-base';

export default class FaHeart extends React.Component {
  render() {
    return (
      <IconBase width="13" height="10" viewBox="0 0 13 10" style={{ stroke: 'white' }} {...this.props}>
        <defs>
          <style>{`
            .cls-arrow-next-1 {
              fill: none;
              stroke-width: 1px;
              fill-rule: evenodd;
            }
          `}</style>
        </defs>
        <path className="cls-arrow-next-1" d="M1,5H12" />
        <path className="cls-arrow-next-1" d="M7.72,1.006L11.992,5,7.72,8.993" />
      </IconBase>
    );
  }
}
