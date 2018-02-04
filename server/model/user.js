const connection = require('./index');
const crypto = require('crypto'); 

const secret = 'sprakerUser';

const userModel = {};



userModel.create = function(username, password) {
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

module.exports = userModel;
