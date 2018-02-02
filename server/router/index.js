const express = require('express');
const router = express.Router();
const imageCtrl = require('../controller/image');

router.get('/image/auth', function (req, res, next) {
  imageCtrl.auth(req, res);
});

module.exports = router;