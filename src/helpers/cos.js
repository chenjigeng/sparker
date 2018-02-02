import COS from 'cos-js-sdk-v5';

var cos = new COS({
  getAuthorization: function (options, callback) {
    var authorization = COS.getAuthorization({
      SecretId: 'AKIDwqUs1t91C7l8E7N6C2bte9QUIrADpVkj',
      SecretKey: 'tWt0tWyA6mFSP6XorfVDi6F9nBJBoCNI',
      Method: options.Method,
      Key: options.Key,
    });
    callback(authorization);
  }
});

export {
  cos,
};
