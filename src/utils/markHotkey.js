export function MarkHotkey(options) {
  const { type, key } = options;

  // Return our "plugin" object, containing the `onKeyDown` handler.
  return {
    onKeyDown(event, change, editor) {
      // Check that the key pressed matches our `key` option.
      if (!event.metaKey || event.key !== key) return;
      // Prevent the default characters from being inserted.
      event.preventDefault();
      const { value } = editor;
      const selection = value.selection;
      const { startKey, endKey, startOffset, endOffset } = selection;
      if (startKey === endKey && startOffset === endOffset) {
        change.select({
          anchorKey: value.startBlock.getFirstText().key,
          anchorOffset: 0,
          focusKey: value.startBlock.getFirstText().key,
          focusOffset: value.startBlock.text.length
        }).toggleMark(type).deselect().select(selection);
      } else {
        change.toggleMark(type);
      }
      return true;
    }
  };
}