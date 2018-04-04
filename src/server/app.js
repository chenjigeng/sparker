import initRouter from './router';
import './model';

const bodyParser = require('body-parser');
const session = require('express-session');
// const path = require('path');
// const cors = require('cors');



export default function initServer (app) {

  // app.use(function (req, res, next) {
  //   res.header('Access-Control-Allow-Origin', '*');        
  //   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  //   res.header('Access-Control-Allow-Headers', 'Content-Type');
  //   res.header('Access-Control-Allow-Credentials','true');
  //   next();
  // })
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(session({
    secret: 'This is sparker server',
    cookie: {maxAge: 60 * 1000 * 60 * 24 * 14},
    resave: false,
    saveUninitialized: true,
  }));
  
  initRouter(app);
  
}
