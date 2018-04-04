import React from 'react';
import PropTypes from 'prop-types';
// import './dialog.less';
if (process.env.BUILD_TARGET !== 'server') {
  require('./dialog.less');
}

export class Dialog extends React.Component {

  static propTypes = {
    visible: PropTypes.bool.isRequired,
    title: PropTypes.string,
    onCancel: PropTypes.func.isRequired,
    className: PropTypes.string,
  }

  // componentDidMount() {
  //   document.addEventListener('click', e => {
  //     this.mousePosition = {
  //       x: e.pageX,
  //       y: e.pageY,
  //       rect: e.target.getBoundingClientRect(),
  //     };
  //   });
  // }

  // componentDidUpdate(prevProps, prevState) {
  //   const { visible } = this.props;
  //   if (visible) {
  //     if (!prevProps.visible) {
  //       setTimeout(() => {
  //         const { x, y, rect } = this.mousePosition;
  //         const dialopRect = this.dialogContent.getBoundingClientRect();
  //         this.dialogContent.style.left = `${x - rect.width - dialopRect.width / 2}px`;
  //         this.dialogContent.style.top = `${y - rect.height - dialopRect.height / 2}px`;
  //         this.dialogContent.classList.add('visible');
  //       }, 100);       
  //     }
  //   } else {
  //     this.dialogContent.classList.remove('visible');
  //   }
  // }

  renderHeader = () => {
    const { title, onCancel } = this.props;
    return (
      <div className="spark-dialog-header">
        <span>{title}</span>
        <i className="spark-icon-close" onClick={onCancel}></i>
      </div>
    );
  }

  render () {
    const { visible, title, onCancel, className } = this.props;

    return (
      <div className={`spark-dialog ${className}`}>
        <div className="spark-dialog-wrapper" onClick={onCancel} style={{ display: visible ? 'block' : 'none'}}></div>
        <div 
          className="spark-dialog-content"
          style={{ display: visible ? 'block' : 'none'}}
          ref={(dialogContent) => this.dialogContent = dialogContent}
        >
          { title && this.renderHeader() }
          { this.props.children }
        </div>
      </div>
    );
  }
}

Dialog.Header = (props) => (
  <div className="spark-dialog-header">
    { props.children }
  </div>
);

Dialog.Body = (props) => (
  <div className="spark-dialog-body">
    { props.children }
  </div>
);

Dialog.Footer = (props) => (
  <div className="spark-dialog-footer">
    { props.children }
  </div>
);
