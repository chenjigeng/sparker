import React from 'react';
import PropTypes from 'prop-types';
import * as Icons from './Icons';

export class HoverMenu extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.object.isRequired,
  }

  componentDidUpdate () {
    this.updateHovermenu();
  }

  updateHovermenu = () => {
    const { value } = this.props;
    const menu = this.menu;
    if (!menu) {
      return;
    }
    if (value.isBlurred || value.isEmpty) {
      menu.removeAttribute('style');
      return;
    }
    setTimeout(() => {
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      menu.style.opacity = 1;
      menu.style.top = `${rect.top + window.scrollY - menu.offsetHeight}px`;
      menu.style.left = `${rect.left + window.scrollX - menu.offsetWidth / 2 + rect.width / 2}px`;
    });
  }

  renderButton = (type, Icon) => {
    const isActive = this.hasMark(type);
    const onMouseDown = event => this.onClickMark(event, type);

    return (
      <span key={type} className="button" onMouseDown={onMouseDown} data-active={isActive}>
        <Icon />
      </span>
    );
  }

  renderButtons = () => {
    const list = [
      this.renderButton('bold', Icons.MdBoldIcon, (
        <div>
          <div>粗体</div>
          <div>⌘+B</div>
        </div>
      ), true),
      this.renderButton('italic', Icons.MdItalicIcon, (
        <div>
          <div>斜体</div>
          <div>⌘+I</div>
        </div>
      ), true),
      this.renderButton('strikethrough', Icons.MdStrikethroughIcon, (
        <div>
          <div>下划线</div>
          <div>⌘+S</div>
        </div>
      ) ,true),
      this.renderButton('underline', Icons.MdUnderlineIcon, (
        <div>
          <div>下划线</div>
          <div>⌘+U</div>
        </div>
      ), true),
    ];
    return list;
  }

  hasMark = (type) => {
    const { value } = this.props;
    return value.activeMarks.some(mark => mark.type === type);
  }

  onClickMark = (event, type) => {
    event.preventDefault();
    const { value } = this.props;
    const change = value.change().toggleMark(type);
    this.props.onChange(change);
  }

  render () {
    return (
      <div className="menu hover-menu" ref={menu => this.menu = menu}>
        { this.renderButtons() }
      </div>
    );
  }
}