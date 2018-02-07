import React from 'react';
import PropTypes from 'prop-types';
import * as Icons from './Icons';
import {
  findDOMNode
} from 'slate-react';
import * as Component from '../SparkComponent';


export class Toolbar extends React.Component {

  static propTypes = {
    onChange: PropTypes.func.isRequired,
  }

  onInputChange = (event) => {
    const { value } = this.props;
    const string = event.target.value;
    const texts = value.document.getTexts();
    const decorations = [];

    texts.forEach((node) => {
      const { key, text } = node;
      const parts = text.split(string);
      let offset = 0;

      parts.forEach((part, i) => {
        if (i !== 0) {
          decorations.push({
            anchorKey: key,
            anchorOffset: offset - string.length,
            focusKey: key,
            focusOffset: offset,
            marks: [{ type: 'highlight' }],
          });
        }

        offset = offset + part.length + string.length;
      });
    });

    const change = value.change()
      .setOperationFlag('save', false)
      .setValue({ decorations })
      .setOperationFlag('save', true);
    this.props.onChange(change, false);
  }

  renderButton = (type, Icon, tooltip, isMark) => {
    const isActive = this.hasMark(type) || this.hasBlock(type);
    const onMouseDown = (event) => {
      if (isMark) {
        this.onClickMark(event, type);
      } else {
        this.onClickBlock(event, type);
      }
    };

    return (
      <Component.ToolTip
        key={type}
        content={tooltip}
      >
        <span key={type} className="button" onMouseDown={onMouseDown} data-active={isActive}>
          <Icon />
        </span>
      </Component.ToolTip>
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
      this.renderButton('order-list', Icons.GoListOrderIcon, (
        <div>
          <div>有序列表</div>
          <div>⌘+Shift+O</div>
        </div>
      )),
      this.renderButton('unorder-list', Icons.GoListUnorderIcon, (
        <div>
          <div>无序列表</div>
          <div>⌘+Shift+U</div>
        </div>
      )),
      this.renderButton('check-list-item', Icons.MdCheckBoxIcon, (
        <div>
          <div>任务列表</div>
          <div>⌘+Shift+C</div>
        </div>
      )),
    ];
    return list;
  }
  
  hasBlock = (type) => {
    const { value } = this.props;
    return value.blocks.some(block => block.type === type);
  }

  hasMark = (type) => {
    const { value } = this.props;
    return value.activeMarks.some(mark => mark.type === type);
  }

  onClickMark = (event, type) => {
    event.preventDefault();
    const { value } = this.props;
    const selection = value.selection;
    const { startKey, endKey, startOffset, endOffset } = selection;
    let change;
    if (startKey === endKey && startOffset === endOffset) {
      change = value.change().select({
        anchorKey: value.startBlock.getFirstText().key,
        anchorOffset: 0,
        focusKey: value.startBlock.getFirstText().key,
        focusOffset: value.startBlock.text.length
      }).toggleMark(type).deselect().select(selection);
    } else {
      change = value.change().toggleMark(type);
    }
    this.props.onChange(change);
  }

  onClickBlock = (event, type) => {
    event.preventDefault();
    const { value } = this.props;
    const parentType = value.document.getParent(value.startBlock.key) && value.document.getParent(value.startBlock.key).type;    
    let change;
    if (value.startBlock.type === type) {
      change = value.change().setBlock('paragrahp');
    } else if (type === 'order-list') {
      // 该元素不在有序列表里        
      if (!parentType || parentType !== 'numbered-list') {
        change = value.change().wrapBlock('numbered-list').setBlock(type);          
      } else {
        change = value.change().setBlock(type);          
      }
    } else if (type === 'unorder-list') {
      // 该元素不在无序列表里
      if (!parentType || parentType !== 'bulleted-list') {
        change = value.change().wrapBlock('bulleted-list').setBlock(type);
      } else {
        change = value.change().setBlock(type);
      } 
    } else if (type === 'check-list-item') {
      change = value.change().setBlock(type);
    }
    this.props.onChange(change);
  }

  render () {
    return (
      <div className="menu toolbar-menu">
        { this.renderButtons() }
        <div className="search">
          <Icons.MdSearchIcon className='search-icon'/>
          <input
            className="search-box"
            type="search"
            placeholder="Search the text..."
            onChange={this.onInputChange}
          />
        </div>
      </div>
    );
  }
}
