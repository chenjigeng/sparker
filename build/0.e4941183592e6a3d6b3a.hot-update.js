exports.id = 0;
exports.modules = {

/***/ "./src/server/model/doc.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator__ = __webpack_require__("babel-runtime/regenerator");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise__ = __webpack_require__("babel-runtime/core-js/promise");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_asyncToGenerator__ = __webpack_require__("babel-runtime/helpers/asyncToGenerator");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_asyncToGenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_asyncToGenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_core_js_json_stringify__ = __webpack_require__("babel-runtime/core-js/json/stringify");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_core_js_json_stringify___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_core_js_json_stringify__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__permission__ = __webpack_require__("./src/server/model/permission.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__index__ = __webpack_require__("./src/server/model/index.js");





var _this = this;



// const crypto = require('crypto');
var moment = __webpack_require__("moment");

var Constant = __webpack_require__("./src/server/config/index.js");

var docModel = {};

var content = __WEBPACK_IMPORTED_MODULE_3_babel_runtime_core_js_json_stringify___default()({
  document: {
    nodes: [{
      object: 'block',
      type: 'paragraph',
      nodes: [{
        object: 'text',
        leaves: [{
          text: 'Hello World'
        }]
      }]
    }]
  }
});

docModel.create = function () {
  var _ref = __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_asyncToGenerator___default()( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(function _callee(userId) {
    var doc, _ref2, result, prevDocs, docId, newDocs, results;

    return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            doc = {
              content: content,
              name: '未命名文档',
              create_time: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
              update_time: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
            };
            _context.prev = 1;
            _context.next = 4;
            return __WEBPACK_IMPORTED_MODULE_5__index__["a" /* default */].$query('Insert Into document Set ?', doc);

          case 4:
            _ref2 = _context.sent;
            result = _ref2.result;
            _context.next = 8;
            return docModel.fetchDocs(userId);

          case 8:
            prevDocs = _context.sent;
            docId = result.insertId;
            newDocs = prevDocs.concat(docId);
            _context.next = 13;
            return __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a.all([docModel.updateDocs(userId, newDocs.toString()), __WEBPACK_IMPORTED_MODULE_4__permission__["a" /* default */].create(userId, docId, Constant.permissionConstant.OWNER)]);

          case 13:
            results = _context.sent;
            return _context.abrupt('return', __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a.resolve(result));

          case 17:
            _context.prev = 17;
            _context.t0 = _context['catch'](1);
            return _context.abrupt('return', __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a.reject(_context.t0));

          case 20:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[1, 17]]);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();

docModel.fetchDoc = function () {
  var _ref3 = __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_asyncToGenerator___default()( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(function _callee2(docId) {
    var _ref4, result;

    return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return __WEBPACK_IMPORTED_MODULE_5__index__["a" /* default */].$query('select * from document where doc_id = ?', [docId]);

          case 3:
            _ref4 = _context2.sent;
            result = _ref4.result;
            return _context2.abrupt('return', __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a.resolve(result));

          case 8:
            _context2.prev = 8;
            _context2.t0 = _context2['catch'](0);
            return _context2.abrupt('return', __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a.reject(_context2.t0));

          case 11:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, _this, [[0, 8]]);
  }));

  return function (_x2) {
    return _ref3.apply(this, arguments);
  };
}();

docModel.fetchDocs = function () {
  var _ref5 = __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_asyncToGenerator___default()( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(function _callee3(userId) {
    var _ref6, result, docs;

    return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return __WEBPACK_IMPORTED_MODULE_5__index__["a" /* default */].$query('select docs from user where user_id = ?', [userId]);

          case 3:
            _ref6 = _context3.sent;
            result = _ref6.result;

            if (result.length) {
              _context3.next = 7;
              break;
            }

            return _context3.abrupt('return', __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a.reject({
              code: Constant.resCodes.EQUAL
            }));

          case 7:
            docs = [];

            if (result[0].docs) {
              docs = new Array(result[0].docs);
            }
            return _context3.abrupt('return', __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a.resolve(docs));

          case 12:
            _context3.prev = 12;
            _context3.t0 = _context3['catch'](0);
            return _context3.abrupt('return', __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a.reject(_context3.t0));

          case 15:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, _this, [[0, 12]]);
  }));

  return function (_x3) {
    return _ref5.apply(this, arguments);
  };
}();

docModel.updateDocs = function () {
  var _ref7 = __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_asyncToGenerator___default()( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(function _callee4(userId, docs) {
    var _ref8, result;

    return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return __WEBPACK_IMPORTED_MODULE_5__index__["a" /* default */].$query('update user set docs = ? where user_id = ?', [docs, userId]);

          case 3:
            _ref8 = _context4.sent;
            result = _ref8.result;
            return _context4.abrupt('return', __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a.resolve(result));

          case 8:
            _context4.prev = 8;
            _context4.t0 = _context4['catch'](0);
            return _context4.abrupt('return', __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a.reject(_context4.t0));

          case 11:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, _this, [[0, 8]]);
  }));

  return function (_x4, _x5) {
    return _ref7.apply(this, arguments);
  };
}();

docModel.updateDoc = function () {
  var _ref9 = __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_asyncToGenerator___default()( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(function _callee5(docId, content) {
    var _ref10, result;

    return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            _context5.next = 3;
            return __WEBPACK_IMPORTED_MODULE_5__index__["a" /* default */].$query('update document set content = ? where doc_id = ?', [content, docId]);

          case 3:
            _ref10 = _context5.sent;
            result = _ref10.result;
            return _context5.abrupt('return', __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a.resolve(result));

          case 8:
            _context5.prev = 8;
            _context5.t0 = _context5['catch'](0);
            return _context5.abrupt('return', __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a.reject(_context5.t0));

          case 11:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, _this, [[0, 8]]);
  }));

  return function (_x6, _x7) {
    return _ref9.apply(this, arguments);
  };
}();

docModel.fetchUserDocs = function () {
  var _ref11 = __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_asyncToGenerator___default()( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(function _callee6(userId) {
    var docsId, sql, _ref12, result;

    return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            _context6.next = 3;
            return docModel.fetchDocs(userId);

          case 3:
            docsId = _context6.sent;

            if (docsId.length) {
              _context6.next = 6;
              break;
            }

            return _context6.abrupt('return', __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a.resolve([]));

          case 6:
            sql = 'Select * from document where doc_id in (' + docsId.toString() + ')';
            _context6.next = 9;
            return __WEBPACK_IMPORTED_MODULE_5__index__["a" /* default */].$query(sql);

          case 9:
            _ref12 = _context6.sent;
            result = _ref12.result;
            return _context6.abrupt('return', __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a.resolve(result));

          case 14:
            _context6.prev = 14;
            _context6.t0 = _context6['catch'](0);
            return _context6.abrupt('return', __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a.reject(_context6.t0));

          case 17:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, _this, [[0, 14]]);
  }));

  return function (_x8) {
    return _ref11.apply(this, arguments);
  };
}();

// export default  docModel;
/* harmony default export */ __webpack_exports__["a"] = (docModel);

/***/ })

};
//# sourceMappingURL=0.e4941183592e6a3d6b3a.hot-update.js.map