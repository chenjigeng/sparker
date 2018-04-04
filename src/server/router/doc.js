import docCtrl from '../controller/doc';
import express from 'express';

const router = express.Router();

router.post('/', (req, res) => {
  docCtrl.create(req, res);
});


export default router;