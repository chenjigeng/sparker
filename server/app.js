var express = require('express');
var app = express();
var slate = require('slate');
const Value = slate.Value;

var server = require('http').createServer(app);
var io = require('socket.io')(server);

server.listen(3001, function() {
  console.log('connect');
});

let value = Value.fromJSON({
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
});

io.on('connection', function (socket) {
  console.log('connect');
  socket.emit('init', { value: value })

  socket.on('update', (data) => {
    value = value.change().applyOperations(data.ops).value;
    socket.broadcast.emit('updateFromOthers', data );
  })
})
