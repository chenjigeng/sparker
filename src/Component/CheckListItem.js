import React from 'react';
import { CheckBox } from '../SparkComponent';

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
    console.log(checked);
    return (
      <CheckBox
        className="check-list-item"
        checked={checked}
        onChange={this.onChange}
        attributes={attributes}
      >{children}</CheckBox>
    );
  }

}
