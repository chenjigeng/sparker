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
var redisStore = __webpack_require__("./node_modules/connect-redis/index.js");
// const path = require('path');
// const cors = require('cors');


function initServer(app) {

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

  // app.use(session({
  //   secret: config.sessionConfig.secret,
  //   cookie: {maxAge: config.sessionConfig.maxAge },
  //   resave: false,
  //   saveUninitialized: true,
  //   store: new RedisStore({
  //     client: ping.redisClient,
  //   }),
  // }));

  app.use(express.static(path.resolve(__dirname + '../../../build/public')));
  app.use(express.static(path.resolve(__dirname + '../../../build/static')));
  app.use(express.static(path.resolve(__dirname + '../../../build')));

  Object(__WEBPACK_IMPORTED_MODULE_0__router__["a" /* default */])(app);
}
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, "src/server"))

/***/ }),

/***/ "./src/server/redis/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise__ = __webpack_require__("babel-runtime/core-js/promise");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise__);

var redis = __webpack_require__("redis");

var client = redis.createClient();

client.sget = function (key) {
  return new __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise___default.a(function (resolve, reject) {
    client.get(key, function (err, value) {
      if (err) {
        reject(err);
        return;
      }
      resolve(value);
    });
  });
};

/* harmony default export */ __webpack_exports__["a"] = (client);

/***/ }),

/***/ "./src/server/socket/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__ = __webpack_require__("babel-runtime/core-js/json/stringify");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_regenerator__ = __webpack_require__("babel-runtime/regenerator");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_regenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_asyncToGenerator__ = __webpack_require__("babel-runtime/helpers/asyncToGenerator");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_asyncToGenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_asyncToGenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__redis__ = __webpack_require__("./src/server/redis/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__model_doc__ = __webpack_require__("./src/server/model/doc.js");





// const http = require('http');
var socket = __webpack_require__("socket.io");
var slate = __webpack_require__("slate");
var Value = slate.Value;

function init(server) {
  var io = socket(server, { origins: '*:*' });
  // io.set('transports', ['websocket', 'xhr-polling', 'jsonp-polling', 'htmlfile', 'flashsocket']);
  io.set('origins', '*:*');
  io.on('connection', function (socket) {
    var _this = this;

    socket.on('initSocket', function () {
      var _ref = __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_asyncToGenerator___default()( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_1_babel_runtime_regenerator___default.a.mark(function _callee(_ref2) {
        var docId = _ref2.docId;
        var doc, result, value;
        return __WEBPACK_IMPORTED_MODULE_1_babel_runtime_regenerator___default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                // 加入以docId为标识的房间
                socket.join(docId);
                _context.next = 3;
                return __WEBPACK_IMPORTED_MODULE_3__redis__["a" /* default */].sget(docId);

              case 3:
                doc = _context.sent;

                if (!doc) {
                  _context.next = 7;
                  break;
                }

                socket.emit('init', { value: Value.fromJSON(JSON.parse(doc)) });
                return _context.abrupt('return');

              case 7:
                _context.next = 9;
                return __WEBPACK_IMPORTED_MODULE_4__model_doc__["a" /* default */].fetchDoc(docId);

              case 9:
                result = _context.sent;
                value = Value.fromJSON(JSON.parse(result[0].content));

                __WEBPACK_IMPORTED_MODULE_3__redis__["a" /* default */].set(docId, result[0].content);
                socket.emit('init', { value: value });

              case 13:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());

    socket.on('update', function () {
      var _ref3 = __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_asyncToGenerator___default()( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_1_babel_runtime_regenerator___default.a.mark(function _callee2(data) {
        var docId, doc, value, content;
        return __WEBPACK_IMPORTED_MODULE_1_babel_runtime_regenerator___default.a.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                docId = data.docId;
                // 将该文档的修改内容发送给其他正在访问该文档的人

                socket.broadcast.to(docId).emit('updateFromOthers', data);
                _context2.next = 4;
                return __WEBPACK_IMPORTED_MODULE_3__redis__["a" /* default */].sget(docId);

              case 4:
                doc = _context2.sent;
                value = Value.fromJSON(JSON.parse(doc)).change().applyOperations(data.ops).value;
                content = __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(value.toJSON());
                // 将更新的内容存入数据库，并且更新缓存数据库的内容

                __WEBPACK_IMPORTED_MODULE_3__redis__["a" /* default */].set(docId, content);
                _context2.next = 10;
                return __WEBPACK_IMPORTED_MODULE_4__model_doc__["a" /* default */].updateDoc(docId, content);

              case 10:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, _this);
      }));

      return function (_x2) {
        return _ref3.apply(this, arguments);
      };
    }());
  });

  return io;
}

/* harmony default export */ __webpack_exports__["default"] = (init);

/***/ })

};
//# sourceMappingURL=0.c99d4cbe5b92b546de37.hot-update.js.map