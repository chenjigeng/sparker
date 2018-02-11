const http = require('http');
const socket = require('socket.io');
const slate = require('slate');
const Value = slate.Value;
function init (app) {
  const server = http.createServer(app);
  const io = socket(server);
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
                  text: 'Hello World'
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

    io.emit('connect');

    socket.on('initSocket', ({ id, docId }) => {
      socket.emit('init', { value: value });      
    });
  
    socket.on('update', (data) => {
      value = value.change().applyOperations(data.ops).value;
      socket.broadcast.emit('updateFromOthers', data );
    });
  });

  return server;
}

module.exports = init;