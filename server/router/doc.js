const express = require('express');
const router = express.Router();
const docCtrl = require('../controller/doc');

console.log(docCtrl);
router.post('/', (req, res) => {
  console.log(docCtrl);
  docCtrl.create(req, res);
});


module.exports = router;