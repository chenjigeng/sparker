import React from 'react';
import './Message.less';
import { Notify } from './Notify';

let seed = 0;

function genUid () {
  return `msgID-${+new Date()}-${seed++}`;
}

export class Message extends React.Component {

  state = {
    messages: [],
  };

  add (message) {
    const { messages } = this.state;
    const newMessage = message;
    newMessage.mid = genUid();
    console.log('messages', messages);
    this.state.messages = messages.concat(newMessage);
    this.setState({
      messages: messages.concat(newMessage)
    });
  }

  remove (mid) {
    const { messages } = this.state;
    const newMessages = messages.filter((item) => item.mid !== mid);
    this.setState({
      messages: newMessages,
    });
  }

  renderMessages () {
    const messageNodes = this.state.messages.map((message) => {
      const onClose = () => {
        this.remove(message.mid);
        message.onClose && message.onClose();
      };
      console.log(message);
      return (
        <Notify
          key={message.mid}
          onClose={onClose}
          content={message.content}
          duration={message.duration || 3}
          type={message.type}
        />
      );
    });
    return messageNodes;
  }

  render () {
    return (
      <div className="spark-message">
        { this.renderMessages() }
      </div>
    );
  }
}


