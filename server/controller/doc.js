const docModel = require('../model/doc');
const { resCodes } = require('../config'); 

const docCtrl = {};

docCtrl.create = async function (req, res) {
  try {
    if (!req.session.login) {
      res.status(200).send({
        code: resCodes.NO_LOGIN,
        msg: '您没有登录',
      });
      return;
    }
    const result = await docModel.create(req.session.userId);
    res.status(200).send({
      code: resCodes.OK,
      docId: result.insertId,
      msg: '创建文档成功',
    });
  } catch (e) {
    res.status(200).send({
      code: resCodes.CREATE_DOC_ERROR,
      msg: '创建文档失败',
    });
  }
};


module.exports = docCtrl;
