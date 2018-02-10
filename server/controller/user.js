const userModel = require('../model/user');
const { resCodes } = require('../config'); 

const userCtrl = {};

userCtrl.regist = async function (req, res, next) {
  const { username, password } = req.body;
  try {
    const result = await userModel.create(username, password);
    const docResult = await userModel.fetchUserInfo(result.user_id);    
    req.session.login = true;
    req.session.username = username;
    req.session.userId = result.insertId;
    res.status(200).send({
      code: resCodes.OK,
      msg: '创建成功',
      docs: docResult,
    });
  } catch (err) {
    console.log(err);
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(200).send({
        code: resCodes.USERNAME_REPEAT,
        msg: '账号重复',
      });
    }
  }
};

userCtrl.login = async function (req, res, next) {
  const { username, password } = req.body;
  try {
    const result = await userModel.confirm(username, password);
    const docResult = await userModel.fetchUserInfo(result.user_id);
    req.session.login = true;
    req.session.username = username;
    req.session.userId = result.user_id;
    res.status(200).send({
      code: resCodes.OK,
      msg: '登录成功',
      docs: docResult,
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
