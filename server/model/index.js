const mysql = require('mysql');
const config = require('../config');

// mysql 连接
const connection = mysql.createConnection(config.mysqlConfig);

connection.connect((err) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log('mysql connect');
});

connection.$query = function(...args) {
  return new Promise((resolve, reject) => {
    connection.query(...args, (err, result, fields) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({
        result,
        fields
      });    
    });
  });
};

module.exports = connection;
