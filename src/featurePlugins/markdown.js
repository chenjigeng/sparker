export function MarkdownPlugins (options) {
  return {
    onKeyDown (event, change) {
      console.log(event.key)
      console.log(event.metaKey)
      switch (event.key) {
        case ' ': return onSpace(event, change);
        case 'Backspace': return onBackspace(event, change);
        case 'Enter': return onEnter(event, change);
        default: return;
      }
    }
  }
}

function onSpace (event, change) {
  const { value } = change;
  if (value.isExpanded) return;
  const { startBlock, startOffset } = value
  const chars = startBlock.text.slice(0, startOffset).replace(/\s*/g, '')
  const type = getType(chars)

  if (!type) return
  if (type === 'unorder-list' && startBlock.type === 'unorder-list') return
  if (type === 'order-list' && startBlock.type === 'order-list') return;
  event.preventDefault()

  change.setBlock(type)

  if (type === 'unorder-list') {
    change.wrapBlock('bulleted-list')
  } else if (type === 'order-list') {
    change.wrapBlock('numbered-list');
  }

  change.extendToStartOf(startBlock).delete()
  return true
} 

function onBackspace (event, change) {
  const { value } = change
  if (value.isExpanded) return
  if (value.startOffset !== 0) return

  const { startBlock } = value
  if (startBlock.type === 'paragraph') return

  event.preventDefault()
  change.setBlock('paragraph')

  if (startBlock.type === 'unorder-list') {
    change.unwrapBlock('bulleted-list')
  } else if (startBlock.type === 'order-list') {
    change.unwrapBlock('numbered-list')
  }

  return true
}

function onEnter (event, change) {
  const { value } = change
  console.log(event.metaKey);
  console.log(event.key);
  if (value.isExpanded) return

  const { startBlock, startOffset, endOffset } = value
  if (startOffset === 0 && startBlock.text.length === 0) return onBackspace(event, change)
  if (endOffset !== startBlock.text.length) return
  console.log(startBlock.type)
  
  if (startBlock.type === 'code' && !event.metaKey) {
    change.delete();
    change.insertText('\n');
    console.log('123123');
    return true;
  }

  if (
    startBlock.type !== 'heading-one' &&
    startBlock.type !== 'heading-two' &&
    startBlock.type !== 'heading-three' &&
    startBlock.type !== 'heading-four' &&
    startBlock.type !== 'heading-five' &&
    startBlock.type !== 'heading-six' &&
    startBlock.type !== 'block-quote' &&
    startBlock.type !== 'code'
  ) {
    return
  }

  event.preventDefault()
  change.splitBlock().setBlock('paragraph')
  return true
}

function getType (type) {
  if (/^\d+.$/gi.test(type)) {
    return 'order-list';
  }
  switch (type) {
    case '#': return 'heading-one';
    case '##': return 'heading-two';
    case '###': return 'heading-three';
    case '####': return 'heading-four';
    case '#####': return 'heading-five';
    case '```': return 'code';
    case '*':
    case '-':
    case '+': return 'unorder-list';
    case '>': return 'block-quote';
    default: return null; 
  }
}