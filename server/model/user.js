const connection = require('./index');
const crypto = require('crypto'); 

const secret = 'sprakerUser';

const userModel = {};



userModel.create = function (username, password) {
  return new Promise((resolve, reject) => {
    const cipher = crypto.createCipher('aes192', secret);
    let enc = cipher.update(password, 'utf8', 'hex');
    enc += cipher.final('hex');
    console.log(enc);
    const user = {
      username,
      password: enc,
    };
    connection.query('Insert Into user Set ?', user, function(err, result, fields) {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }
      resolve(result);
    });
  });
};

userModel.confirm = (username, password) => {
  return new Promise((resolve, reject) => {
    connection.query('select password from user where username = ?', [username], (err, result, fidlds) => {
      console.log(result);
      if (!result.length) {
        reject({
          code: 'EMPTY'
        });
      }
      const pass = result[0].password;
      console.log(pass);
      const decipher = crypto.createDecipher('aes192', secret);
      let dec = decipher.update(pass, 'hex', 'utf8');//编码方式从hex转为utf-8;
      dec += decipher.final('utf8');//编码方式从utf-8;
      console.log(dec);
      if (dec === password) {
        resolve();
      } else {
        reject({
          code: 'NO_EQUAL',
        });
      }
    });
    
  });
};

module.exports = userModel;
