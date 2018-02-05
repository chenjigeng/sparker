const express = require('express');
const router = express.Router();
const userCtrl = require('../controller/user');

router.post('/login', (req, res) => {
  userCtrl.login(req, res);
});


module.exports = router;