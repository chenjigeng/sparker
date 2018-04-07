exports.id = 0;
exports.modules = {

/***/ "./src/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__server__ = __webpack_require__("./src/server.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_http__ = __webpack_require__("http");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_http___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_http__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__server_socket__ = __webpack_require__("./src/server/socket/index.js");



var server = __WEBPACK_IMPORTED_MODULE_1_http___default.a.createServer(__WEBPACK_IMPORTED_MODULE_0__server__["default"]);

var io = Object(__WEBPACK_IMPORTED_MODULE_2__server_socket__["default"])(server);

/* eslint-enable */
var currentApp = __WEBPACK_IMPORTED_MODULE_0__server__["default"];

server.listen("3000" || 3000, function (error) {
  if (error) {
    console.log(error);
  }

  console.log('🚀 started');
});

if (true) {
  console.log('✅  Server-side HMR Enabled!');

  module.hot.accept("./src/server.js", function () {
    console.log('🔁  HMR Reloading `./server`...');
    server.close(function () {
      console.log('关闭这个');
    });
    io.close();
    // server.removeAllListeners();
    var newApp = __webpack_require__("./src/server.js").default;
    var newServer = __WEBPACK_IMPORTED_MODULE_1_http___default.a.createServer(newApp);
    io = Object(__WEBPACK_IMPORTED_MODULE_2__server_socket__["default"])(newServer);
    newServer.listen(3000, function (err) {
      console.log('重连');
    });
    currentApp = newApp;
    console.log('5555');
  });

  module.hot.accept("./src/server/socket/index.js", function () {
    console.log('server socket reload');
    server.close();
    __webpack_require__("./src/server/socket/index.js").default(server);
    server.listen(3000, function (error) {
      console.log('更新了socket');
    });
  });
}

/* harmony default export */ __webpack_exports__["default"] = (server);

/***/ })

};
//# sourceMappingURL=0.87637b0d251a6d7e5b30.hot-update.js.map