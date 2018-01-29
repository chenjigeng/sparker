import React from 'react';
import './ToolTip.less';

export class ToolTip extends React.Component {
  
  render () {
    const { children, content } = this.props; 
    return  (
      <div className="spark-tooltip">
        <div className="spark-tooltip__content">
          { children }
        </div>
        <div className="spark-tooltip__popup">
          { content }
        </div>
      </div>
    );
  }
}
