const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
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
app.use(express.static('build'));
app.use(express.static('./router'));
initRouter(app);

server.listen(3001, function() {
  console.log('connect');
});
