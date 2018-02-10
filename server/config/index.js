const resCodes = require('./responseCodes');

const mysqlConfig = {
  host: 'localhost',
  user: 'chenjg',
  password: 'chenjg',
  database: 'sparker',
};

const permissionConstant = {
  'NO_PERMISSION': 0,
  'NO_WRITE': 1,
  'OWNER': 2,
};

module.exports = {
  mysqlConfig,
  resCodes,
  permissionConstant,
};
