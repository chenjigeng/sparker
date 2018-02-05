const express = require('express');
const router = express.Router();
const userCtrl = require('../controller/user');

router.post('/', (req, res) => {
  userCtrl.regist(req, res);
});

router.get('/', (req, res) => {
  res.send('hello');
});

module.exports = router;