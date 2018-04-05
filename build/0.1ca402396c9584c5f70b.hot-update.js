exports.id = 0;
exports.modules = {

/***/ "./src/server/controller/doc.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator__ = __webpack_require__("babel-runtime/regenerator");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_asyncToGenerator__ = __webpack_require__("babel-runtime/helpers/asyncToGenerator");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_asyncToGenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_asyncToGenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__model_doc__ = __webpack_require__("./src/server/model/doc.js");




var _require = __webpack_require__("./src/server/config/index.js"),
    resCodes = _require.resCodes;

var docCtrl = {};

docCtrl.create = function () {
  var _ref = __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_asyncToGenerator___default()( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(function _callee(req, res) {
    var result;
    return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;

            if (req.session.login) {
              _context.next = 4;
              break;
            }

            res.status(200).send({
              code: resCodes.NO_LOGIN,
              msg: '您没有登录'
            });
            return _context.abrupt('return');

          case 4:
            _context.next = 6;
            return __WEBPACK_IMPORTED_MODULE_2__model_doc__["a" /* default */].create(req.session.userId);

          case 6:
            result = _context.sent;

            res.status(200).send({
              code: resCodes.OK,
              docId: result.insertId,
              msg: '创建文档成功'
            });
            _context.next = 13;
            break;

          case 10:
            _context.prev = 10;
            _context.t0 = _context['catch'](0);

            res.status(200).send({
              code: resCodes.CREATE_DOC_ERROR,
              msg: '创建文档失败'
            });

          case 13:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 10]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

/* harmony default export */ __webpack_exports__["a"] = (docCtrl);

/***/ })

};
//# sourceMappingURL=0.1ca402396c9584c5f70b.hot-update.js.map