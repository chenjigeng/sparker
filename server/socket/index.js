const http = require('http');
const socket = require('socket.io');
const slate = require('slate');
const docModel = require('../model/doc');
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

    socket.on('initSocket', async ({ docId }) => {
      const result = await docModel.fetchDoc(docId);
      socket.emit('init', { value: Value.fromJSON(JSON.parse(result[0].content)) });      
    });
  
    socket.on('update', (data) => {
      value = value.change().applyOperations(data.ops).value;
      socket.broadcast.emit('updateFromOthers', data );
    });
  });

  return server;
}

module.exports = init;