import app from './server';
import http from 'http';
import initSocket from './server/socket';
const server = http.createServer(app);

let io = initSocket(server);

/* eslint-disable */
let currentApp = app;

server.listen(process.env.PORT || 3000, error => {
  if (error) {
    console.log(error);
  }

  console.log('🚀 started');
});

if (module.hot) {
  console.log('✅  Server-side HMR Enabled!');

  module.hot.accept('./server.js', () => {
    console.log('🔁  HMR Reloading `./server`...');
    server.close(function () {
      console.log('关闭这个');
    });
    io.close();
    // server.removeAllListeners();
    const newApp = require('./server').default;
    const newServer = http.createServer(newApp);
    io = initSocket(newServer);
    newServer.listen(3000, err => {
      console.log('重连');
    });
    currentApp = newApp;
    console.log('5555');
  });

  module.hot.accept('./server/socket/index', () => {
    console.log('server socket reload');
    server.close();
    require('./server/socket').default(server);
    server.listen(3000, error => {
      console.log('更新了socket');
    }) 
  })
}

export default server;