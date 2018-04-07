exports.id = 0;
exports.modules = {

/***/ "./src/server/app.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname) {/* harmony export (immutable) */ __webpack_exports__["a"] = initServer;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__router__ = __webpack_require__("./src/server/router/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__model__ = __webpack_require__("./src/server/model/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__redis_index__ = __webpack_require__("./src/server/redis/index.js");




var bodyParser = __webpack_require__("body-parser");
var express = __webpack_require__("express");
var path = __webpack_require__("path");
var session = __webpack_require__("express-session");
var redisStore = __webpack_require__("./node_modules/connect-redis/index.js")(session);

function initServer(app) {

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
    cookie: { maxAge: 60 * 1000 * 60 * 24 * 14 },
    resave: false,
    saveUninitialized: true,
    store: new redisStore({
      client: __WEBPACK_IMPORTED_MODULE_2__redis_index__["a" /* default */]
    })
  }));

  app.use(express.static(path.resolve(__dirname + '../../../build/public')));
  app.use(express.static(path.resolve(__dirname + '../../../build/static')));
  app.use(express.static(path.resolve(__dirname + '../../../build')));

  Object(__WEBPACK_IMPORTED_MODULE_0__router__["a" /* default */])(app);
}
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, "src/server"))

/***/ })

};
//# sourceMappingURL=0.c0d31cddea108c4d639c.hot-update.js.map