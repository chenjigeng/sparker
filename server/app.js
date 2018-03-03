const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const app = express();

const initRouter = require('./router');
const socketInit = require('./socket');
const server = require('./socket')(app);
require('./model');



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'This is sparker server',
  cookie: {maxAge: 60 * 1000 * 60 * 24 * 14},
  resave: false,
  saveUninitialized: true,
}));
app.use(express.static(path.resolve(__dirname + '/../build')));

initRouter(app);

app.get('*', function (req, res) {
  res.sendFile(path.resolve(__dirname + '/../build/index.html'));
});

server.listen(3001, function() {
  console.log('connect');
});
