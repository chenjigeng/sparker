const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const initRouter = require('./router');
const socketInit = require('./socket');
const server = require('./socket')(app);
require('./model');


initRouter(app);
app.use(bodyParser.urlencoded({ extends: false }));

server.listen(3001, function() {
  console.log('connect');
});
