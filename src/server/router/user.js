import express from 'express';
import userCtrl from '../controller/user';

const router = express.Router();

router.post('/', (req, res) => {
  userCtrl.regist(req, res);
});

router.get('/', (req, res) => {
  res.send('hello');
});

export default  router;