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

module.exports = connection;
