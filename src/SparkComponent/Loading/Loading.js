// import './Loading.less';
import React from 'react';
if (process.env.BUILD_TARGET !== 'server') {
  require('./Loading.less');
}

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
