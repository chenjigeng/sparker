import io from 'socket.io-client';

const socket = io('http://192.168.199.146:3001');

export { socket };