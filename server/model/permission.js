const connection = require('./index');
const crypto = require('crypto');

const permissionModel = {};

permissionModel.create = async (userId, docId, permissionRight) => {
  try {
    const permission = {
      user_id: userId,
      doc_id: docId,
      permission: permissionRight,
    };
    const result = await connection.$query('insert into permission set ?', permission);
    return Promise.resolve(result);
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports = permissionModel;
