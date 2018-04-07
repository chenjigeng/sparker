exports.id = 0;
exports.modules = {

/***/ "./node_modules/connect-redis/index.js":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./node_modules/connect-redis/lib/connect-redis.js");


/***/ }),

/***/ "./node_modules/connect-redis/lib/connect-redis.js":
/***/ (function(module, exports, __webpack_require__) {

/*!
 * Connect - Redis
 * Copyright(c) 2012 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

var debug = __webpack_require__("debug")('connect:redis');
var redis = __webpack_require__("redis");
var util = __webpack_require__("util");
var noop = function(){};

/**
 * One day in seconds.
 */

var oneDay = 86400;

function getTTL(store, sess, sid) {
  if (typeof store.ttl === 'number' || typeof store.ttl === 'string') return store.ttl;
  if (typeof store.ttl === 'function') return store.ttl(store, sess, sid);
  if (store.ttl) throw new TypeError('`store.ttl` must be a number or function.');

  var maxAge = sess.cookie.maxAge;
  return (typeof maxAge === 'number'
    ? Math.floor(maxAge / 1000)
    : oneDay);
}

/**
 * Return the `RedisStore` extending `express`'s session Store.
 *
 * @param {object} express session
 * @return {Function}
 * @api public
 */

module.exports = function (session) {

  /**
   * Express's session Store.
   */

  var Store = session.Store;

  /**
   * Initialize RedisStore with the given `options`.
   *
   * @param {Object} options
   * @api public
   */

  function RedisStore (options) {
    if (!(this instanceof RedisStore)) {
      throw new TypeError('Cannot call RedisStore constructor as a function');
    }

    var self = this;

    options = options || {};
    Store.call(this, options);
    this.prefix = options.prefix == null
      ? 'sess:'
      : options.prefix;

    delete options.prefix;

    this.scanCount = Number(options.scanCount) || 100;
    delete options.scanCount;

    this.serializer = options.serializer || JSON;

    if (options.url) {
      options.socket = options.url;
    }

    // convert to redis connect params
    if (options.client) {
      this.client = options.client;
    }
    else if (options.socket) {
      this.client = redis.createClient(options.socket, options);
    }
    else {
      this.client = redis.createClient(options);
    }

    // logErrors
    if(options.logErrors){
      // if options.logErrors is function, allow it to override. else provide default logger. useful for large scale deployment
      // which may need to write to a distributed log
      if(typeof options.logErrors != 'function'){
        options.logErrors = function (err) {
          console.error('Warning: connect-redis reported a client error: ' + err);
        };
      }
      this.client.on('error', options.logErrors);
    }

    if (options.pass) {
      this.client.auth(options.pass, function (err) {
        if (err) {
          throw err;
        }
      });
    }

    this.ttl = options.ttl;
    this.disableTTL = options.disableTTL;

    if (options.unref) this.client.unref();

    if ('db' in options) {
      if (typeof options.db !== 'number') {
        console.error('Warning: connect-redis expects a number for the "db" option');
      }

      self.client.select(options.db);
      self.client.on('connect', function () {
        self.client.select(options.db);
      });
    }

    self.client.on('error', function (er) {
      debug('Redis returned err', er);
      self.emit('disconnect', er);
    });

    self.client.on('connect', function () {
      self.emit('connect');
    });
  }

  /**
   * Inherit from `Store`.
   */

  util.inherits(RedisStore, Store);

  /**
   * Attempt to fetch session by the given `sid`.
   *
   * @param {String} sid
   * @param {Function} fn
   * @api public
   */

  RedisStore.prototype.get = function (sid, fn) {
    var store = this;
    var psid = store.prefix + sid;
    if (!fn) fn = noop;
    debug('GET "%s"', sid);

    store.client.get(psid, function (er, data) {
      if (er) return fn(er);
      if (!data) return fn();

      var result;
      data = data.toString();
      debug('GOT %s', data);

      try {
        result = store.serializer.parse(data);
      }
      catch (er) {
        return fn(er);
      }
      return fn(null, result);
    });
  };

  /**
   * Commit the given `sess` object associated with the given `sid`.
   *
   * @param {String} sid
   * @param {Session} sess
   * @param {Function} fn
   * @api public
   */

  RedisStore.prototype.set = function (sid, sess, fn) {
    var store = this;
    var args = [store.prefix + sid];
    if (!fn) fn = noop;

    try {
      var jsess = store.serializer.stringify(sess);
    }
    catch (er) {
      return fn(er);
    }

    args.push(jsess);

    if (!store.disableTTL) {
      var ttl = getTTL(store, sess, sid);
      args.push('EX', ttl);
      debug('SET "%s" %s ttl:%s', sid, jsess, ttl);
    } else {
      debug('SET "%s" %s', sid, jsess);
    }

    store.client.set(args, function (er) {
      if (er) return fn(er);
      debug('SET complete');
      fn.apply(null, arguments);
    });
  };

  /**
   * Destroy the session associated with the given `sid`.
   *
   * @param {String} sid
   * @api public
   */

  RedisStore.prototype.destroy = function (sid, fn) {
    debug('DEL "%s"', sid);
    if (Array.isArray(sid)) {
      var multi = this.client.multi();
      var prefix = this.prefix;
      sid.forEach(function (s) {
        multi.del(prefix + s);
      });
      multi.exec(fn);
    } else {
      sid = this.prefix + sid;
      this.client.del(sid, fn);
    }
  };

  /**
   * Refresh the time-to-live for the session with the given `sid`.
   *
   * @param {String} sid
   * @param {Session} sess
   * @param {Function} fn
   * @api public
   */

  RedisStore.prototype.touch = function (sid, sess, fn) {
    var store = this;
    var psid = store.prefix + sid;
    if (!fn) fn = noop;
    if (store.disableTTL) return fn();

    var ttl = getTTL(store, sess);

    debug('EXPIRE "%s" ttl:%s', sid, ttl);
    store.client.expire(psid, ttl, function (er) {
      if (er) return fn(er);
      debug('EXPIRE complete');
      fn.apply(this, arguments);
    });
  };

  /**
   * Fetch all sessions' Redis keys using non-blocking SCAN command
   *
   * @param {Function} fn
   * @api private
   */

  function allKeys (store, cb) {
    var keysObj = {}; // Use an object to dedupe as scan can return duplicates
    var pattern = store.prefix + '*';
    var scanCount = store.scanCount;
    debug('SCAN "%s"', pattern);
    (function nextBatch (cursorId) {
      store.client.scan(cursorId, 'match', pattern, 'count', scanCount, function (err, result) {
        if (err) return cb(err);

        var nextCursorId = result[0];
        var keys = result[1];

        debug('SCAN complete (next cursor = "%s")', nextCursorId);

        keys.forEach(function (key) {
          keysObj[key] = 1;
        });

        if (nextCursorId != 0) {
          // next batch
          return nextBatch(nextCursorId);
        }

        // end of cursor
        return cb(null, Object.keys(keysObj));
      });
    })(0);
  }

  /**
   * Fetch all sessions' ids
   *
   * @param {Function} fn
   * @api public
   */

  RedisStore.prototype.ids = function (fn) {
    var store = this;
    var prefixLength = store.prefix.length;
    if (!fn) fn = noop;

    allKeys(store, function (err, keys) {
      if (err) return fn(err);

      keys = keys.map(function (key) {
        return key.substr(prefixLength);
      });
      return fn(null, keys);
    });
  };


  /**
   * Fetch all sessions
   *
   * @param {Function} fn
   * @api public
   */

  RedisStore.prototype.all = function (fn) {
    var store = this;
    var prefixLength = store.prefix.length;
    if (!fn) fn = noop;

    allKeys(store, function (err, keys) {
      if (err) return fn(err);

      if (keys.length === 0) return fn(null,[]);

      store.client.mget(keys, function (err, sessions) {
        if (err) return fn(err);

        var result;
        try {
          result = sessions.map(function (data, index) {
            data = data.toString();
            data = store.serializer.parse(data);
            data.id = keys[index].substr(prefixLength);
            return data;
          });
        } catch (e) {
          err = e;
        }

        return fn(err, result);
      });
    });
  };

  return RedisStore;
};


/***/ }),

/***/ "./src/server/app.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname) {/* harmony export (immutable) */ __webpack_exports__["a"] = initServer;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__router__ = __webpack_require__("./src/server/router/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__model__ = __webpack_require__("./src/server/model/index.js");



var bodyParser = __webpack_require__("body-parser");
var express = __webpack_require__("express");
var path = __webpack_require__("path");
var session = __webpack_require__("express-session");
var redisStore = __webpack_require__("./node_modules/connect-redis/index.js");
var redis = __webpack_require__("./src/server/redis/index.js");
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
      client: redis
    })
  }));
  console.log(path.resolve(__dirname + '../../../build/public'));
  console.log(path.resolve(__dirname + '/static'));
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
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
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

/* harmony default export */ __webpack_exports__["default"] = (client);

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
                return __WEBPACK_IMPORTED_MODULE_3__redis__["default"].sget(docId);

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

                __WEBPACK_IMPORTED_MODULE_3__redis__["default"].set(docId, result[0].content);
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
                return __WEBPACK_IMPORTED_MODULE_3__redis__["default"].sget(docId);

              case 4:
                doc = _context2.sent;
                value = Value.fromJSON(JSON.parse(doc)).change().applyOperations(data.ops).value;
                content = __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(value.toJSON());
                // 将更新的内容存入数据库，并且更新缓存数据库的内容

                __WEBPACK_IMPORTED_MODULE_3__redis__["default"].set(docId, content);
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

/***/ }),

/***/ "debug":
/***/ (function(module, exports) {

module.exports = require("debug");

/***/ }),

/***/ "util":
/***/ (function(module, exports) {

module.exports = require("util");

/***/ })

};
//# sourceMappingURL=0.ea286f9852200ea85ce6.hot-update.js.map