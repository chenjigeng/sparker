const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const initRouter = require('./router');
const socketInit = require('./socket');
const server = require('./socket')(app);
require('./model');


app.use(bodyParser.urlencoded({ extended: false }));
initRouter(app);

server.listen(3001, function() {
  console.log('connect');
});
