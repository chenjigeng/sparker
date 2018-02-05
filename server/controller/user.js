const userModel = require('../model/user');
const { resCodes } = require('../config'); 

const userCtrl = {};



userCtrl.regist = async function (req, res, next) {
  console.log(req.body);
  console.log('hhh');
  const { username, password } = req.body;
  try {
    const result = await userModel.create(username, password);
    console.log(result);
    console.log(result[0]);
    res.status(200).send({
      code: resCodes.OK,
      msg: '创建成功',
    });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      console.log('账号重复');
      res.status(200).send({
        code: resCodes.USERNAME_REPEAT,
        msg: '账号重复',
      });
    }
  }
};

userCtrl.login = async function (req, res, next) {
  console.log(req.body);
  const { username, password } = req.body;

  try {
    const result = await userModel.confirm(username, password);
    res.status(200).send({
      code: resCodes.OK,
      msg: '登录成功',
    });
  } catch (err) {
    if (err.code === 'NO_EQUAL') {
      res.status(200).send({
        code: resCodes.PASSWORD_NO_EQUAL,
        msg: '密码错误',
      });
    } else if (err.code === 'EMPTY') {
      res.status(200).send({
        code: resCodes.USERNAME_NO_EXIST,
        msg: '账号不存在',
      });
    }
    console.log(err);
  }
};

module.exports = userCtrl;
