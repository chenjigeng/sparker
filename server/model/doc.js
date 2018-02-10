const connection = require('./index');
const permissionModel = require('./permission');
const crypto = require('crypto');

const Constant = require('../config');

const secret = 'sprakerUser';

const docModel = {};

const content = JSON.stringify({
  document: {
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        nodes: [
          {
            object: 'text',
            leaves: [
              {
                text: 'Hello World'
              }
            ]
          }
        ]
      }
    ]
  }
});


docModel.create = async function (username, userId) {
  const doc = {
    content,
    name: '未命名文档',
  };
  try {
    const { result } = await connection.$query('Insert Into document Set ?', doc);
    const prevDocs = await docModel.fetchDocs(username);
    const docId = result.insertId;
    const newDocs = prevDocs.push(docId);
    const results = await Promise.all([
      docModel.updateDocs(username, newDocs.toString()),
      permissionModel.create(userId, docId, Constant.permissionConstant.OWNER),
    ]);
    return Promise.resolve(result);
  } catch (err) {
    return Promise.reject(err);
  }

};

docModel.fetchDocs = async (username) => {
  try {
    const { result, fidlds } = await connection.$query('select docs from user where username = ?', [username]);
    console.log('result is', result);
    if (!result.length) {
      return Promise.reject({
        code: resCode.EQUAL,
      });
    }
    let docs = [];
    if (result[0].docs) {
      docs = new Array(result[0].docs);
    }
    return Promise.resolve(docs);
  } catch (err) {
    return Promise.reject(err);
  }
};

docModel.updateDocs = async (username, docs) => {
  try {
    const { result } = await connection.$query('update user set docs = ? where username = ?', [docs, username]);
    console.log('resss', result);
    return Promise.resolve(result);
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports = docModel;
