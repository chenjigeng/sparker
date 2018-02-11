const express = require('express');
const router = express.Router();
const userCtrl = require('../controller/user');

router.post('/login', (req, res) => {
  userCtrl.login(req, res);
});

router.post('/regist', (req, res) => {
  userCtrl.regist(req, res);
});

router.post('/check', (req, res) => {
  userCtrl.check(req, res);
});
module.exports = router;