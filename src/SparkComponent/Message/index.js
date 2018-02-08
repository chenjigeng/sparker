import { Message } from './Message';
import ReactDom from 'react-dom';
import React from 'react'; 

const MessageManager = {
  messageInstance: null,
  container: null,
  getInstance () {
    if (!this.messageInstance) {
      this.container = document.createElement('div');
      document.body.appendChild(this.container);
      this.messageInstance = ReactDom.render(<Message />, this.container);
    }
    return this.messageInstance;
  },
  show (type, content, duration, onClose) {
    if (typeof duration === 'function') {
      onClose = duration;
      duration = 3;
    }
    const messageInstance = this.getInstance();
    console.log(messageInstance);
    messageInstance.add({
      type,
      content,
      duration,
      onClose,
    });
  },
  destroy () {
    ReactDom.unmountComponentAtNode(this.container);
    document.body.removeChild(this.container);
  }
};

export const message = {
  info (content, duration, onClose) {
    MessageManager.show('info', content, duration, onClose);
  },
  warning (content, duration, onClose) {
    MessageManager.show('warning', content, duration, onClose);
  },
  error (content, duration, onClose) {
    MessageManager.show('error', content, duration, onClose);
  },
  success (content, duration, onClose) {
    MessageManager.show('success', content, duration, onClose);
  }
};
