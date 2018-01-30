import React from 'react';

/**
 * Check list item.
 *
 * @type {Component}
 */

export class CheckListItem extends React.Component {

  /**
   * On change, set the new checked value on the block.
   *
   * @param {Event} event
   */

  onChange = (event) => {
    const checked = event.target.checked;
    const { editor, node } = this.props;
    editor.change(c => c.setNodeByKey(node.key, { data: { checked }}));
  }

  /**
   * Render a check list item, using `contenteditable="false"` to embed the
   * checkbox right next to the block's text.
   *
   * @return {Element}
   */

  render() {
    const { attributes, children, node } = this.props;
    const checked = node.data.get('checked');
    return (
      <div
        className={`check-list-item ${checked ? 'checked' : ''}`}
        contentEditable={false}
        {...attributes}
      >
        <span>
          <input
            type="checkbox"
            checked={checked}
            onChange={this.onChange}
          />
        </span>
        <span contentEditable suppressContentEditableWarning>
          {children}
        </span>
      </div>
    );
  }

}
