const express = require('express');
const app = express();
const slate = require('slate');
const Value = slate.Value;
const COS = require('cos-nodejs-sdk-v5');
const router = require('./router/index');

app.use('/', router);

const server = require('http').createServer(app);
const io = require('socket.io')(server);

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
  socket.emit('init', { value: value });

  socket.on('update', (data) => {
    value = value.change().applyOperations(data.ops).value;
    socket.broadcast.emit('updateFromOthers', data );
  });
});
