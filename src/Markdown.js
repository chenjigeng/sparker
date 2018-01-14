
import { Editor } from 'slate-react'
import { Value } from 'slate'
import PasteLinkify from 'slate-paste-linkify'
import InsertImages from 'slate-drop-or-paste-images'
import PluginEditCode from 'slate-edit-code'
import PluginPrism from 'slate-prism'
import * as Icons from './Icons';

import React from 'react'
import { Image, CheckListItem } from './Component'
import { MarkHotkey } from './utils'
import { MarkdownPlugins, CheckListPlugins } from './featurePlugins';
import './markdown.css'
import { socket } from './Socket';

const plugins = [
  CheckListPlugins,
  MarkdownPlugins(),
  PasteLinkify({ type: 'link' }),
  InsertImages({
    insertImage: (transform, file) => {
      return transform.insertBlock({
        type: 'image',
        isVoid: true,
        data: { file }
      })
    }
  }),
  MarkHotkey({ key: 'b', type: 'bold' }),
  MarkHotkey({ key: 'i', type: 'italic' }),
  MarkHotkey({ key: 's', type: 'strikethrough' }),
  MarkHotkey({ key: 'u', type: 'underline' }),
  // PluginPrism({
  //   onlyIn: node => node.type === 'code',
  //   getSyntax: node => {
  //     const syntax = node.data.get('syntax');
  //     return syntax;
  //   }
  // }),
  // PluginEditCode({
  //   onlyIn: node => node.type === 'code'
  // }),
]

// function CodeNode(props) {
//   return <CodeBlock {...props} />
// }

function CodeBlock(props) {
  const { editor, node } = props
  const language = node.data.get('language')

  function onChange(event) {
    editor.change(c => c.setNodeByKey(node.key, { data: { language: event.target.value }}))
  }

  return (
    <div style={{ position: 'relative' }}>
      <pre>
        <code syntax="javascript" {...props.attributes}>{props.children}</code>
      </pre>
      <div
        contentEditable={false}
        style={{ position: 'absolute', top: '5px', right: '5px' }}
      >
        <select value={language} onChange={onChange} >
          <option value="css">CSS</option>
          <option value="js">JavaScript</option>
          <option value="html">HTML</option>
        </select>
      </div>
    </div>
  )
}

function CodeBlockLine(props) {
  return (
    <div {...props.attributes}>{props.children}</div>
  )
}

const initialValue = Value.fromJSON({});

class SparkerEditor extends React.Component {

  state = {
    value: initialValue,
  }

  constructor () {
    super();
    this.operationQuequ = [];
  }

  componentDidMount() {
    setInterval(this.clearQueue, 200);
    this.initSocketEvent();
  }

  initSocketEvent = () => {
    socket.on('updateFromOthers', (data) => {
      this.operationQuequ = this.operationQuequ.concat(data.ops);
    })
    socket.on('init', (data) => {
      this.setState({
        value: Value.fromJSON(data.value),
      })
    })
  }

  clearQueue = () => {
    if (this.operationQuequ.length) {
      this.applyOperations(this.operationQuequ);
      this.operationQuequ = [];
    }
  }

  onChange = (change, needEmit = true) => {
    const { value } = change;
    const ops = change.operations
      .filter(o => o.type != 'set_selection' && o.type != 'set_value')
      .toJS()
    if (ops.length && needEmit) {
      socket.emit('update', {
        ops,
      });
    }
    this.setState({ value })
  }

  applyOperations = (operations) => {
    const { value } = this.state
    const change = value.change().applyOperations(operations)
    this.setState({
      value: change.value,
    });
  }

  onInputChange = (event) => {
    const { value } = this.state
    const string = event.target.value
    const texts = value.document.getTexts()
    const decorations = []

    texts.forEach((node) => {
      const { key, text } = node
      const parts = text.split(string)
      let offset = 0

      parts.forEach((part, i) => {
        if (i != 0) {
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

    // setting the `save` option to false prevents this change from being added
    // to the undo/redo stack and clearing the redo stack if the user has undone
    // changes.

    const change = value.change()
      .setOperationFlag('save', false)
      .setValue({ decorations })
      .setOperationFlag('save', true)
    this.onChange(change, false)
  }

  renderToolbar = () => {
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

  renderButtons = () => {
    const list = [
      this.renderButton('bold', Icons.MdBoldIcon),
      this.renderButton('italic', Icons.MdItalicIcon),
      this.renderButton('strikethrough', Icons.MdStrikethroughIcon),
      this.renderButton('underline', Icons.MdUnderlineIcon),
      this.renderButton('order-list', Icons.GoListOrderIcon),
      this.renderButton('unorder-list', Icons.GoListUnorderIcon),
      this.renderButton('check-list-item', Icons.MdCheckBoxIcon),
    ];
    return list;
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

  hasBlock = (type) => {
    const { value } = this.state;
    return value.blocks.some(block => block.type === type);
  }

  hasMark = (type) => {
    const { value } = this.state
    return value.activeMarks.some(mark => mark.type == type)
  }

  onClickMark = (event, type) => {
    event.preventDefault()
    const { value } = this.state
    const change = value.change().toggleMark(type)
    this.onChange(change)
  }

  onClickBlock = (event, type) => {
    event.preventDefault();
    const { value } = this.state;
    let change;
    if (value.startBlock.type === type) {
      change = value.change().setBlock('paragrahp');      
    } else {
      change = value.change().setBlock(type);      
    }
    this.onChange(change);
  }

  render() {
    return (
      <div className="editor">
        { this.renderToolbar() }
        <Editor
          className='markdown-body'
          value={this.state.value}
          onChange={this.onChange}
          plugins={plugins}
          renderNode={this.renderNode}
          renderMark={this.renderMark}
          decorateNode={this.decorateNode}
        />
      </div>
    )
  }

  renderNode = (props) => {
    const { attributes, children, node } = props
    switch (node.type) {
      case 'image': return <Image {...props}/>;
      case 'link': return <a href={node.data.get('href')} target='_blank'>{props.children}</a>;
      case 'block-quote': return <blockquote {...attributes}>{children}</blockquote>
      case 'bulleted-list': return <ul {...attributes}>{children}</ul>;
      case 'numbered-list': return <ol {...attributes}>{children}</ol>
      case 'heading-one': return <h1 {...attributes}>{children}</h1>;
      case 'heading-two': return <h2 {...attributes}>{children}</h2>;
      case 'heading-three': return <h3 {...attributes}>{children}</h3>;
      case 'heading-four': return <h4 {...attributes}>{children}</h4>;
      case 'heading-five': return <h5 {...attributes}>{children}</h5>;
      case 'unorder-list': return <li {...attributes}>{children}</li>;
      case 'order-list': return <li {...attributes}>{children}</li>;      
      case 'code': return <CodeBlock {...props} />;
      case 'code_line': return <CodeBlockLine {...props} />;
      case 'check-list-item': return <CheckListItem {...props} />;
      default: return
    }
  }

  renderMark = (props) => {
    const { children, mark } = props;
    switch (mark.type) {
      // case 'code': return <code>{props.children}</code>;       
      case 'bold': return <strong>{props.children}</strong>;
      case 'italic': return <em>{props.children}</em>;
      case 'strikethrough': return <del>{props.children}</del>;
      case 'underline': return <u>{props.children}</u>;
      case 'highlight': return <span className="highlight">{children}</span>
      default: return;
    }
  }
}

export default SparkerEditor;
