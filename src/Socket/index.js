import io from 'socket.io-client';

const socketInit = function() {
  return io('http://127.0.0.1:3001');
};

export { socketInit };