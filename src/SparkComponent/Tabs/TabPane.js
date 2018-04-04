import React from 'react';

export class TabPane extends React.Component {
  
  render () {
    return (
      <div className="spark-tabpane">
        { this.props.children }
      </div>
    );
  }
}
