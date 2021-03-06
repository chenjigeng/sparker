import React from 'react';
import './prism.less';
// import '../../vendor/highlight/highlight.pack';
// import hljs from 'highlight.js';
// import loader from 'monaco-editor/min/vs/loader';

function CodeBlock(props) {

  // console.log(hljs);
  
  const { editor, node } = props;
  const language = node.data.get('language');

  if (!language) {
    editor.change(c => c.setNodeByKey(node.key, { data: { language: 'css' }}));
  }

  function onChange(event) {
    editor.change(c => c.setNodeByKey(node.key, { data: { language: event.target.value }}));
  }

  return (
    <div style={{ position: 'relative' }}>
      <pre>
        <code {...props.attributes}>{props.children}</code>
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
  );
}

function CodeBlockLine(props) {
  return (
    <div {...props.attributes}>{props.children}</div>
  );
}

export {
  CodeBlock,
  CodeBlockLine,
};
