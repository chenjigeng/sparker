const connection = require('./index');
const crypto = require('crypto'); 
const resCode = require('../config/responseCodes');
const docModel = require('./doc');
const moment = require('moment');

const secret = 'sprakerUser';

const userModel = {};



userModel.create = async function (username, password) {
  const cipher = crypto.createCipher('aes192', secret);
  let enc = cipher.update(password, 'utf8', 'hex');
  enc += cipher.final('hex');
  const user = {
    username,
    password: enc,
  };
  try {
    const { result } = await connection.$query('Insert Into user Set ?', user); 
    return Promise.resolve(result);
  } catch (err) {
    return Promise.reject(err);
  } 
};

userModel.confirm = async (username, password) => {

  try {
    const { result, fidlds } = await connection.$query('select * from user where username = ?', [username]);
    if (!result.length) {
      return Promise.reject({
        code: 'EMPTY'
      });
    }
    const pass = result[0].password;
    const decipher = crypto.createDecipher('aes192', secret);
    let dec = decipher.update(pass, 'hex', 'utf8');//编码方式从hex转为utf-8;
    dec += decipher.final('utf8');//编码方式从utf-8;
    if (dec === password) {
      return Promise.resolve(result[0]);
    } else {
      return Promise.reject({
        code: 'NO_EQUAL',
      });
    }
  } catch (err) {
    return Promise.reject(err);
  }

};

userModel.fetchUserInfo = async (userId) => {
  try {
    const result = await docModel.fetchUserDocs(userId);
    return Promise.resolve(result);
  } catch (err) {
    return Promise.reject(err);
  }
};
  

module.exports = userModel;
