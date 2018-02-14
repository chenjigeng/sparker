import io from 'socket.io-client';

const sockerServer = process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:3001': 'http://193.112.17.138:3001';

const socketInit = function() {
  return io(sockerServer);
};

export { socketInit };