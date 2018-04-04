import redisClient from '../redis';
import docModel from '../model/doc';
// const http = require('http');
const socket = require('socket.io');
const slate = require('slate');
const Value = slate.Value;

function init (server) {
  const io = socket(server, { origins: '*:*' });
  // io.set('transports', ['websocket', 'xhr-polling', 'jsonp-polling', 'htmlfile', 'flashsocket']);
  io.set('origins', '*:*');
  io.on('connection', function (socket) {
    socket.on('initSocket', async ({ docId }) => {
      // 加入以docId为标识的房间
      socket.join(docId);
      const doc = await redisClient.sget(docId);
      // 若redis有缓存，则直接从redis上取
      if (doc) {
        socket.emit('init', { value: Value.fromJSON(JSON.parse(doc)) });
        return;
      }
      const result = await docModel.fetchDoc(docId);
      const value = Value.fromJSON(JSON.parse(result[0].content));
      redisClient.set(docId, result[0].content);
      socket.emit('init', { value });      
    });
  
    socket.on('update', async (data) => {
      const { docId } = data;
      // 将该文档的修改内容发送给其他正在访问该文档的人
      socket.broadcast.to(docId).emit('updateFromOthers', data);
      const doc = await redisClient.sget(docId);
      const value = Value.fromJSON(JSON.parse(doc)).change().applyOperations(data.ops).value;
      const content = JSON.stringify(value.toJSON());
      // 将更新的内容存入数据库，并且更新缓存数据库的内容
      redisClient.set(docId, content);
      await docModel.updateDoc(docId, content);
    });
  });

  return io;
}

export default init;