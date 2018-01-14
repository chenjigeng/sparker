
import { Editor } from 'slate-react'
import { Value } from 'slate'
import PasteLinkify from 'slate-paste-linkify'
import InsertImages from 'slate-drop-or-paste-images'
import PluginEditCode from 'slate-edit-code'
import PluginPrism from 'slate-prism'

import React from 'react'
import { Image } from './Component/Image'
import { MarkHotkey } from './utils'
import { MarkdownPlugins } from './featurePlugins';
import './markdown.css'

const plugins = [
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
  PluginPrism({
    onlyIn: node => node.type === 'code',
    getSyntax: node => {
      const syntax = node.data.get('syntax');
      return syntax;
    }
  }),
  PluginEditCode({
    onlyIn: node => node.type === 'code'
  }),
]

// function CodeNode(props) {
//   return <CodeBlock {...props} />
// }

function CodeBlock(props) {
  console.log('123');
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

const initialValue = Value.fromJSON({
  document: {
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        nodes: [
          {
            object: 'text',
            leaves: [
              {
                text: 'A line of text in a paragraph.'
              }
            ]
          }
        ]
      }
    ]
  }
})

class App extends React.Component {

  state = {
    value: initialValue,
  }

  onChange = ({ value }) => {
    console.log(value);
    this.setState({ value })
  }

  onKeyDown = (event, change) => {
    if (!event.metaKey) return;
    // Return with no changes if it's not the "`" key with ctrl pressed.
    switch (event.key) {
      case 'b': {
        event.preventDefault();
        change.toggleMark('bold');
        return true;
      }
      case '`': {
        event.preventDefault();    
        const isCode = change.value.blocks.some(block => block.type === 'code')
        change.setBlock(isCode ? 'paragraph' : 'code')
        return true;
      }
      default: return;
    }
  }

  render() {
    return (
      <Editor
        className='markdown-body'
        onKeyDown={this.onKeyDown}
        value={this.state.value}
        onChange={this.onChange}
        plugins={plugins}
        renderNode={this.renderNode}
        renderMark={this.renderMark}
        decorateNode={this.decorateNode}
      />
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
      case 'code': return <CodeBlock {...props} />
      case 'code_line': return <CodeBlockLine {...props} />
      default: return
    }
  }

  renderMark = (props) => {
    switch (props.mark.type) {
      // case 'code': return <code>{props.children}</code>;       
      case 'bold': return <strong>{props.children}</strong>;
      case 'italic': return <em>{props.children}</em>;
      case 'strikethrough': return <del>{props.children}</del>;
      case 'underline': return <u>{props.children}</u>;
      default: return;
    }
  }
}

export default App;