exports.id = 0;
exports.modules = {

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

/***/ })

};
//# sourceMappingURL=0.a5c77668015350af02e3.hot-update.js.map