export function BlockHotkey(options) {
  const { type, key } = options;

  // Return our "plugin" object, containing the `onKeyDown` handler.
  return {
    onKeyDown(event, change, editor) {
      // Check that the key pressed matches our `key` option.
      if (!(event.metaKey || event.ctrlKey) || event.key !== key || !event.shiftKey) return;
      // Prevent the default characters from being inserted.
      event.preventDefault();
      const { value } = editor;
      const parentType = value.document.getParent(value.startBlock.key) && value.document.getParent(value.startBlock.key).type;    
      if (value.startBlock.type === type) {
        change.setBlock('paragrahp');
      } else if (type === 'order-list') {
        // 该元素不在有序列表里        
        if (!parentType || parentType !== 'numbered-list') {
          change.wrapBlock('numbered-list').setBlock(type);          
        } else {
          change.setBlock(type);          
        }
      } else if (type === 'unorder-list') {
        // 该元素不在无序列表里
        if (!parentType || parentType !== 'bulleted-list') {
          change.wrapBlock('bulleted-list').setBlock(type);
        } else {
          change.setBlock(type);
        } 
      } else if (type === 'check-list-item') {
        change.setBlock(type);
      }
      return false;
    }
  };
}