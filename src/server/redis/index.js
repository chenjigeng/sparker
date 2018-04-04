const redis = require('redis');

const client = redis.createClient();
console.log('22');

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

export default client;
