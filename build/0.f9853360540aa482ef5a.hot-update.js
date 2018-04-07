exports.id = 0;
exports.modules = {

/***/ "./src/Component/SparkerEditor/featurePlugins/markdown.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = MarkdownPlugins;
function MarkdownPlugins(options) {
  return {
    onKeyDown: function onKeyDown(event, change) {
      switch (event.key) {
        case 'Tab':
          return onTab(event, change);
        case ' ':
          return onSpace(event, change);
        case 'Backspace':
          return onBackspace(event, change);
        case 'Enter':
          return onEnter(event, change);
        case '*':
          return handleBold(event, change);
        default:
          return;
      }
    }
  };
}

function handleBold(event, change) {
  var value = change.value;

  if (value.isExpanded) return;
  var startBlock = value.startBlock,
      startOffset = value.startOffset;

  var chars = startBlock.text;
  if (isToggleMark('*', chars, startOffset)) {
    var _findDeleteRangeAndTa = findDeleteRangeAndTargetChars(change, chars, startOffset),
        deleteRange = _findDeleteRangeAndTa.deleteRange,
        boldChars = _findDeleteRangeAndTa.boldChars;

    event.preventDefault();
    console.log(boldChars, deleteRange);
    change.deleteForward(deleteRange).insertText(boldChars).extend(-boldChars.length).addMark('bold').splitInline().removeMark('bold');
  }
  return true;
}

function isToggleMark(markChar, chars, offset) {
  if (chars[offset] === markChar || chars[offset - 1] === markChar) {
    if (chars.match(/\*\*/gi) && chars.match(/\*\*/gi).length >= 1 && chars.match(/\*/gi).length >= 3) {
      return true;
    }
  }
}
function findDeleteRangeAndTargetChars(change, chars, startOffset) {
  var firstIndex = chars.indexOf('**');
  var boldChars = void 0,
      deleteRange = void 0;
  // 若是在后面插入**
  if (startOffset > firstIndex + 1) {
    change.move(-startOffset).move(firstIndex);
    // 当插入位置为前面
    if (chars[startOffset] === '*') {
      deleteRange = startOffset - firstIndex + 1;
      boldChars = chars.slice(firstIndex + 2, startOffset);
    } else {
      // 当插入位置是在后面
      deleteRange = startOffset - firstIndex;
      boldChars = chars.slice(firstIndex + 2, startOffset - 1);
    }
  } else {
    // 在后面插入**
    if (chars[startOffset] === '*') {
      deleteRange = firstIndex - startOffset + 2;
      boldChars = chars.slice(startOffset + 1, firstIndex);
    } else {
      deleteRange = firstIndex - startOffset + 3;
      change.move(-1);
      boldChars = chars.slice(startOffset, firstIndex);
    }
  }
  return {
    boldChars: boldChars,
    deleteRange: deleteRange
  };
}

// 输入tab,换成两个空格
function onTab(event, change) {
  var value = change.value;

  if (value.isExpanded) return;

  event.preventDefault();
  change.delete();
  change.insertText('  ');
  return true;
}

function onSpace(event, change) {
  var value = change.value;

  if (value.isExpanded) return;
  var startBlock = value.startBlock,
      startOffset = value.startOffset;

  var chars = startBlock.text.slice(0, startOffset).replace(/\s*/g, '');
  var type = getType(chars);

  if (!type) return;
  if (type === 'unorder-list' && startBlock.type === 'unorder-list') return;
  if (type === 'order-list' && startBlock.type === 'order-list') return;
  event.preventDefault();

  change.setBlock(type);

  if (type === 'unorder-list') {
    change.wrapBlock('bulleted-list');
  } else if (type === 'order-list') {
    change.wrapBlock('numbered-list');
  }

  change.extendToStartOf(startBlock).delete();
  return true;
}

function onBackspace(event, change) {
  var value = change.value;

  if (value.isExpanded) return;
  if (value.startOffset !== 0) return;

  var startBlock = value.startBlock;

  if (startBlock.type === 'paragraph') return;

  event.preventDefault();
  change.setBlock('paragraph');

  if (startBlock.type === 'unorder-list') {
    change.unwrapBlock('bulleted-list');
  } else if (startBlock.type === 'order-list') {
    change.unwrapBlock('numbered-list');
  }

  return true;
}

function onEnter(event, change) {
  var value = change.value;

  if (value.isExpanded) return;

  var startBlock = value.startBlock,
      startOffset = value.startOffset,
      endOffset = value.endOffset;

  if (startOffset === 0 && startBlock.text.length === 0) return onBackspace(event, change);
  if (startBlock.type === 'code' && !event.shiftKey) {
    change.delete();
    change.insertText('\n');
    return true;
  }
  if (endOffset !== startBlock.text.length) return;

  if (startBlock.type !== 'heading-one' && startBlock.type !== 'heading-two' && startBlock.type !== 'heading-three' && startBlock.type !== 'heading-four' && startBlock.type !== 'heading-five' && startBlock.type !== 'heading-six' && startBlock.type !== 'block-quote' && startBlock.type !== 'code') {
    return;
  }

  event.preventDefault();
  change.splitBlock().setBlock('paragraph');
  return true;
}

function getType(type) {
  if (/^\d+.$/gi.test(type)) {
    return 'order-list';
  }
  switch (type) {
    case '#':
      return 'heading-one';
    case '##':
      return 'heading-two';
    case '###':
      return 'heading-three';
    case '####':
      return 'heading-four';
    case '#####':
      return 'heading-five';
    case '```':
      return 'code';
    case '*':
    case '-':
    case '+':
      return 'unorder-list';
    case '>':
      return 'block-quote';
    default:
      return null;
  }
}

/***/ })

};
//# sourceMappingURL=0.f9853360540aa482ef5a.hot-update.js.map