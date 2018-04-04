import io from 'socket.io-client';

const sockerServer = process.env.NODE_ENV === 'development' ? 'localhost:3000': '';

const socketInit = function() {
  return io(sockerServer);
};

export { socketInit };