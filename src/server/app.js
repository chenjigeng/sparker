import initRouter from './router';
import './model';
import redisClient from './redis/index';

const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const session = require('express-session');
const redisStore = require('connect-redis')(session);


export default function initServer (app) {

  // 支持cors
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
    store: new redisStore({
      client: redisClient,
    })
  }));
  console.log(path.resolve(__dirname + '../../../public'));
  console.log(path.resolve(__dirname + '../../..'));
  
  app.use(express.static(path.resolve(__dirname + '../../../public')));
  app.use(express.static(path.resolve(__dirname + '../../../static')));  
  app.use(express.static(path.resolve(__dirname + '../../..')));
  app.use(express.static(path.resolve(__dirname + '../../../build/public')));
  app.use(express.static(path.resolve(__dirname + '../../../build/static')));  
  app.use(express.static(path.resolve(__dirname + '../../../build')));
  
  initRouter(app);
  
}
