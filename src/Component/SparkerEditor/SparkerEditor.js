import { Editor } from 'slate-react';
import { CodeBlock, CodeBlockLine } from '../CodeBlock';
import { Value } from 'slate';
import PasteLinkify from 'slate-paste-linkify';
import InsertImages from 'slate-drop-or-paste-images';
// import PluginEditCode from 'slate-edit-code'
import PluginPrism from 'slate-prism';
import React from 'react';
import { Image, CheckListItem, HoverMenu } from '..';
import { MarkHotkey, BlockHotkey } from '../../utils';
import { MarkdownPlugins, CheckListPlugins } from '../../featurePlugins';
import { socket } from '../../Socket';
import { Toolbar } from '../Toolbar';
import './markdown.less';

const plugins = [
  PluginPrism({
    onlyIn: node => {
      return node.type === 'code';
    },
    getSyntax: node => {
      return node.data.get('language');
    }
  }),
  BlockHotkey({ key: 'o', type: 'order-list'}),
  BlockHotkey({ key: 'u', type: 'unorder-list'}),
  BlockHotkey({ key: 'c', type: 'check-list-item'}),  
  CheckListPlugins,
  MarkdownPlugins(),
  PasteLinkify({ type: 'link' }),
  InsertImages({
    insertImage: (transform, file) => {
      
      return transform.insertBlock({
        type: 'image',
        isVoid: true,
        data: { file }
      });
    }
  }),
  MarkHotkey({ key: 'b', type: 'bold' }),
  MarkHotkey({ key: 'i', type: 'italic' }),
  MarkHotkey({ key: 's', type: 'strikethrough' }),
  MarkHotkey({ key: 'u', type: 'underline' }),
];

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
    });
    socket.on('init', (data) => {
      this.setState({
        value: Value.fromJSON(data.value),
      });
    });
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
      .filter(o => o.type !== 'set_selection' && o.type !== 'set_value')
      .toJS();
    if (ops.length && needEmit) {
      socket.emit('update', {
        ops,
      });
    }
    this.setState({ value });
  }

  applyOperations = (operations) => {
    const { value } = this.state;
    const change = value.change().applyOperations(operations);
    this.setState({
      value: change.value,
    });
  }

  render() {
    return (
      <div className="editor">
        <Toolbar onChange={this.onChange} value={this.state.value} />
        <HoverMenu onChange={this.onChange} value={this.state.value} />
        <div className="editor-container">
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
      </div>
    );
  }

  renderNode = (props) => {
    const { attributes, children, node } = props;
    switch (node.type) {
      case 'image': return <Image {...props}/>;
      case 'link': return <a href={node.data.get('href')} target='_blank'>{props.children}</a>;
      case 'block-quote': return <blockquote {...attributes}>{children}</blockquote>;
      case 'bulleted-list': return <ul {...attributes}>{children}</ul>;
      case 'numbered-list': return <ol {...attributes}>{children}</ol>;
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
      default: return;
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
      case 'highlight': return <span className="highlight">{children}</span>;
      default: return;
    }
  }
}

export { SparkerEditor };
