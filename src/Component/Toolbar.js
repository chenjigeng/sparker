import React from 'react';
import PropTypes from 'prop-types';
import * as Icons from '../Icons';
import {
  findDOMNode
} from 'slate-react';

export class Toolbar extends React.Component {

  static propTypes = {
    onChange: PropTypes.func.isRequired,
  }

  onInputChange = (event) => {
    const { value } = this.props
    const string = event.target.value
    const texts = value.document.getTexts()
    const decorations = []

    texts.forEach((node) => {
      const { key, text } = node
      const parts = text.split(string)
      let offset = 0

      parts.forEach((part, i) => {
        if (i !== 0) {
          decorations.push({
            anchorKey: key,
            anchorOffset: offset - string.length,
            focusKey: key,
            focusOffset: offset,
            marks: [{ type: 'highlight' }],
          })
        }

        offset = offset + part.length + string.length
      })
    })

    const change = value.change()
      .setOperationFlag('save', false)
      .setValue({ decorations })
      .setOperationFlag('save', true)
    this.props.onChange(change, false)
  }

  renderButton = (type, Icon, isMark) => {
    const isActive = this.hasMark(type) || this.hasBlock(type);
    const onMouseDown = (event) => {
      if (isMark) {
        this.onClickMark(event, type)        
      } else {
        this.onClickBlock(event, type);
      }
    }

    return (
      <span key={type} className="button" onMouseDown={onMouseDown} data-active={isActive}>
        <Icon />
      </span>
    )
  }

  renderButtons = () => {
    const list = [
      this.renderButton('bold', Icons.MdBoldIcon, true),
      this.renderButton('italic', Icons.MdItalicIcon, true),
      this.renderButton('strikethrough', Icons.MdStrikethroughIcon, true),
      this.renderButton('underline', Icons.MdUnderlineIcon, true),
      this.renderButton('order-list', Icons.GoListOrderIcon),
      this.renderButton('unorder-list', Icons.GoListUnorderIcon),
      this.renderButton('check-list-item', Icons.MdCheckBoxIcon),
    ];
    return list;
  }
  
  hasBlock = (type) => {
    const { value } = this.props;
    return value.blocks.some(block => block.type === type);
  }

  hasMark = (type) => {
    const { value } = this.props
    return value.activeMarks.some(mark => mark.type === type)
  }

  onClickMark = (event, type) => {
    event.preventDefault()
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
      change = value.change().toggleMark(type)
    }
    this.props.onChange(change)
  }

  onClickBlock = (event, type) => {
    event.preventDefault();
    const { value } = this.props;
    const parentType = value.document.getParent(value.startBlock.key) && value.document.getParent(value.startBlock.key).type;    
    let change;
    if (type === 'order-list') {
      if (value.startBlock.type === type) {
        change = value.change().setBlock('paragrahp');             
      } else {
        // 该元素不在有序列表里        
        if (!parentType || parentType !== 'numbered-list') {
          change = value.change().wrapBlock('numbered-list').setBlock(type);          
        } else {
          change = value.change().setBlock(type);          
        }
      }
    } else if (type === 'unorder-list') {
      if (value.startBlock.type === type) {
        change = value.change().setBlock('paragrahp');     
      } else {
        // 该元素不在无序列表里
        if (!parentType || parentType !== 'bulleted-list') {
          change = value.change().wrapBlock('bulleted-list').setBlock(type);
        } else {
          change = value.change().setBlock(type);
        } 
      }
    } else if (type === 'check-list-item') {
      if (value.startBlock.type === type) {
        change = value.change().setBlock('paragrahp');
      } else {
        change = value.change().setBlock(type);
      }
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
    )
  }
}
