import connection from './index';
// const crypto = require('crypto');

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

export default permissionModel;
// export default  permissionModel;
