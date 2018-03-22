const http = require('http');
const socket = require('socket.io');
const slate = require('slate');
const redisClient = require('../redis');
const docModel = require('../model/doc');
const Value = slate.Value;

const storeValues = {

};

function init (app) {
  const server = http.createServer(app);
  const io = socket(server);
  
  io.on('connection', function (socket) {
    console.log('connect');

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
      const { docId, ops } = data;
      // 将该文档的修改内容发送给其他正在访问该文档的人
      socket.broadcast.to(docId).emit('updateFromOthers', data);
      const doc = await redisClient.sget(docId);
      const value = Value.fromJSON(JSON.parse(doc)).change().applyOperations(data.ops).value;
      content = JSON.stringify(value.toJSON());
      // 将更新的内容存入数据库，并且更新缓存数据库的内容
      redisClient.set(docId, content);
      const result = await docModel.updateDoc(docId, content);
    });
  });

  return server;
}

module.exports = init;