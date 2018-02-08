import React from 'react';
import PropTypes from 'prop-types';


export class Notify extends React.Component {

  static propTypes = {
    duration: PropTypes.number,
    onClose: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
    content: PropTypes.any.isRequired
  };

  componentDidMount() {
    const { duration, onClose } = this.props;
    this.tid = setTimeout(() => {
      onClose();
    }, duration * 1000);
  }

  handleClose = () => {
    clearTimeout(this.tid);
    this.props.onClose();
  }
  
  handleMouseEnter = () => {
    clearTimeout(this.tid);
  }

  handleMouseLeave = () => {
    const { duration, onClose } = this.props;
    this.tid = setTimeout(() => {
      onClose();
    }, duration * 1000);
  }

  render () {
    const { content, type } = this.props;
    console.log(content);

    return (
      <div
        className="spark-message-notify"
      >
        <div 
          className="spark-message-notify-content"
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
        >
          <i type={type}/>
          { content }        
        </div>
      </div>
    );
  }
}
