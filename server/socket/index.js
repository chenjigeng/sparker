const http = require('http');
const socket = require('socket.io');
const slate = require('slate');
const docModel = require('../model/doc');
const Value = slate.Value;

const storeValues = {

};

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
      if (storeValues[docId]) {
        socket.emit('init', { value: storeValues[docId] });
        return;
      }
      const result = await docModel.fetchDoc(docId);
      const value = Value.fromJSON(JSON.parse(result[0].content));
      storeValues[docId] = value;        
      socket.emit('init', { value });      
    });
  
    socket.on('update', async (data) => {
      const { docId, ops } = data;
      socket.broadcast.emit('updateFromOthers', data);
      storeValues[docId] = storeValues[docId].change().applyOperations(data.ops).value;
      content = JSON.stringify(storeValues[docId].toJSON());
      const result = await docModel.updateDoc(docId, content);
    });
  });

  return server;
}

module.exports = init;