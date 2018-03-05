const redis = require('redis');

const client = redis.createClient();

client.sget = function (key) {
  return new Promise((resolve, reject) => {
    client.get(key, (err, value) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(value);
    });
  });
};

module.exports = client;
