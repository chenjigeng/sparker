const express = require('express');
const router = express.Router();
const docCtrl = require('../controller/doc');

router.post('/', (req, res) => {
  docCtrl.create(req, res);
});


module.exports = router;