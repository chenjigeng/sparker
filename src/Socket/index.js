import io from 'socket.io-client';

const sockerServer = process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:3001': '';

const socketInit = function() {
  return io(sockerServer);
};

export { socketInit };