exports.id = 0;
exports.modules = {

/***/ "./src/server/controller/user.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator__ = __webpack_require__("babel-runtime/regenerator");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_asyncToGenerator__ = __webpack_require__("babel-runtime/helpers/asyncToGenerator");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_asyncToGenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_asyncToGenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__model_user__ = __webpack_require__("./src/server/model/user.js");




var _require = __webpack_require__("./src/server/config/index.js"),
    resCodes = _require.resCodes;

var userCtrl = {};

userCtrl.regist = function () {
  var _ref = __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_asyncToGenerator___default()( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(function _callee(req, res, next) {
    var _req$body, username, password, result;

    return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _req$body = req.body, username = _req$body.username, password = _req$body.password;
            _context.prev = 1;
            _context.next = 4;
            return __WEBPACK_IMPORTED_MODULE_2__model_user__["a" /* default */].create(username, password);

          case 4:
            result = _context.sent;

            // const docResult = await userModel.fetchUserInfo(result.user_id);    
            req.session.login = true;
            req.session.username = username;
            req.session.userId = result.insertId;
            res.status(200).send({
              code: resCodes.OK,
              msg: '创建成功',
              docs: []
            });
            _context.next = 15;
            break;

          case 11:
            _context.prev = 11;
            _context.t0 = _context['catch'](1);

            console.log(_context.t0);
            if (_context.t0.code === 'ER_DUP_ENTRY') {
              res.status(200).send({
                code: resCodes.USERNAME_REPEAT,
                msg: '账号重复'
              });
            }

          case 15:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[1, 11]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

userCtrl.login = function () {
  var _ref2 = __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_asyncToGenerator___default()( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(function _callee2(req, res, next) {
    var _req$body2, username, password, result, docResult;

    return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _req$body2 = req.body, username = _req$body2.username, password = _req$body2.password;
            _context2.prev = 1;
            _context2.next = 4;
            return __WEBPACK_IMPORTED_MODULE_2__model_user__["a" /* default */].confirm(username, password);

          case 4:
            result = _context2.sent;
            _context2.next = 7;
            return __WEBPACK_IMPORTED_MODULE_2__model_user__["a" /* default */].fetchUserInfo(result.user_id);

          case 7:
            docResult = _context2.sent;

            console.log(req);
            console.log(req.session);
            req.session.login = true;
            req.session.username = username;
            req.session.userId = result.user_id;
            res.status(200).send({
              code: resCodes.OK,
              msg: '登录成功',
              docs: docResult
            });
            _context2.next = 20;
            break;

          case 16:
            _context2.prev = 16;
            _context2.t0 = _context2['catch'](1);

            if (_context2.t0.code === 'NO_EQUAL') {
              res.status(200).send({
                code: resCodes.PASSWORD_NO_EQUAL,
                msg: '密码错误'
              });
            } else if (_context2.t0.code === 'EMPTY') {
              res.status(200).send({
                code: resCodes.USERNAME_NO_EXIST,
                msg: '账号不存在'
              });
            }
            console.log(_context2.t0);

          case 20:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[1, 16]]);
  }));

  return function (_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

userCtrl.logout = function () {
  var _ref3 = __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_asyncToGenerator___default()( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(function _callee3(req, res) {
    return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            console.log('logout');
            if (req.session) {
              req.session.login = false;
            }
            res.status(200).send({
              code: resCodes.OK,
              msg: '登出成功'
            });

          case 3:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function (_x7, _x8) {
    return _ref3.apply(this, arguments);
  };
}();

userCtrl.check = function () {
  var _ref4 = __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_asyncToGenerator___default()( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(function _callee4(req, res) {
    var _req$session, userId, username, docResult;

    return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;

            if (!req.session.login) {
              _context4.next = 9;
              break;
            }

            _req$session = req.session, userId = _req$session.userId, username = _req$session.username;
            _context4.next = 5;
            return __WEBPACK_IMPORTED_MODULE_2__model_user__["a" /* default */].fetchUserInfo(userId);

          case 5:
            docResult = _context4.sent;

            res.status(200).send({
              code: resCodes.OK,
              msg: '账号已登录',
              docs: docResult,
              username: username
            });
            _context4.next = 10;
            break;

          case 9:
            res.status(200).send({
              code: resCodes.NO_LOGIN,
              msg: '账号未登录'
            });

          case 10:
            _context4.next = 15;
            break;

          case 12:
            _context4.prev = 12;
            _context4.t0 = _context4['catch'](0);

            res.status(200).send({
              code: resCodes.NO_LOGIN,
              msg: _context4.t0.msg || _context4.t0.message || _context4.t0
            });

          case 15:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this, [[0, 12]]);
  }));

  return function (_x9, _x10) {
    return _ref4.apply(this, arguments);
  };
}();

/* harmony default export */ __webpack_exports__["a"] = (userCtrl);

/***/ })

};
//# sourceMappingURL=0.4e5dabe1f8ea5bb2403a.hot-update.js.map