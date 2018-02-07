export const CheckListPlugins = {
  onKeyDown (event, change) {
    switch(event.key) {
      case 'Backspace': return onBackspace(event, change);
      case 'Enter': return onEnter(event, change);
      case 'y': return onCheckList(event, change);
      default: return;
    } 
  }
};

function onEnter (event, change) {
  const { value } = change;
  
  if (value.startBlock.type === 'check-list-item') {
    if (event.shiftKey || value.startBlock.isEmpty) {
      change.setBlock('paragraph');
    } else {
      change.splitBlock().setBlock({ data: { checked: false }});
    }
    return true;
  }
}

function onBackspace (event, change) {
  const { value } = change;
  
  if (value.isCollapsed &&
      value.startBlock.type === 'check-list-item' &&
      value.selection.startOffset === 0) {
    change.setBlock('paragraph');
    return true;
  }
}

function onCheckList (event, change) {
  const { value } = change;

  if (event.shiftKey && event.metaKey && event.key === 'y') {
    if (value.startBlock.type === 'check-list-item') {
      change.setBlock('paragraph');
      return true;
    } else {
      change.setBlock('check-list-item');
    }
  }
}
