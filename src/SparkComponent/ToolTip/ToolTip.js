import React from 'react';
import './ToolTip.less';
// if (process.env.BUILD_TARGET !== 'server') {
//   require('./ToolTip.less');
// }
export class ToolTip extends React.Component {

  updateToolTip = () => {
    const clientRect = this.content.getClientRects()[0];
    const popupLeft = clientRect.x - this.popup.clientWidth / 2 + clientRect.width / 2;
    const popupTop = clientRect.y + clientRect.height + 10;
    this.popup.style.left = `${popupLeft}px`;
    this.popup.style.top = `${popupTop}px`;
  }
  
  
  render () {
    const { children, content } = this.props; 
    return  (
      <div className="spark-tooltip" onMouseOver={this.updateToolTip}>
        <div 
          className="spark-tooltip__content"
          ref={(content) => this.content = content}
        >
          { children }
        </div>
        <div 
          className="spark-tooltip__popup"
          ref={(popup) => this.popup = popup}
        >
          <div>{ content }</div>
        </div>
      </div>
    );
  }
}
