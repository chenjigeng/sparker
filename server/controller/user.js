const userModel = require('../model/user');

const userCtrl = {};


userCtrl.create = async function(req, res, next) {
  console.log(req.body);
  const { username, password } = req.body;
  const result = await userModel.create(username, password);
  console.log(result);
  res.send(200);
};

module.exports = userCtrl;
