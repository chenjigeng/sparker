import './Loading.less';
import React from 'react';

export class Loading extends React.Component {
  render () {
    return (
      <div>
        <div className="spark-loading">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    );
  }
}
