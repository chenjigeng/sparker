// var COS = require('cos-nodejs-sdk-v5');
// var path = require('path');
// // 创建实例
// var cos = new COS({
//     SecretId: 'AKIDwqUs1t91C7l8E7N6C2bte9QUIrADpVkj',
//     SecretKey: 'tWt0tWyA6mFSP6XorfVDi6F9nBJBoCNI',
// });
// // 分片上传
// cos.sliceUploadFile({
//     Bucket: 'sparker-1252588471',
//     Region: 'ap-guangzhou',
//     Key: 'app.js',
//     FilePath: __dirname + '../app.js'
// }, function (err, data) {
//     console.log(err, data);
// });

/**
 * nodejs 签名样例
 * 命令行启动服务: node auth.js
 * 浏览器访问: http://127.0.0.1:3333
 */

var crypto = require('../vendors/crypto');

var SecretId = 'AKIDwqUs1t91C7l8E7N6C2bte9QUIrADpVkj';
var SecretKey = 'tWt0tWyA6mFSP6XorfVDi6F9nBJBoCNI';


function camSafeUrlEncode(str) {
  return encodeURIComponent(str)
      .replace(/!/g, '%21')
      .replace(/'/g, '%27')
      .replace(/\(/g, '%28')
      .replace(/\)/g, '%29')
      .replace(/\*/g, '%2A');
}

//测试用的key后面可以去掉
var getAuth = function (opt) {
  opt = opt || {};

  var method = (opt.method || opt.Method || 'get').toLowerCase();
  var pathname = opt.pathname || opt.Key || '/';
  var queryParams = opt.params || '';
  var headers = opt.headers || '';
  pathname.indexOf('/') !== 0 && (pathname = '/' + pathname);

  if (!SecretId) return console.error('lack of param SecretId');
  if (!SecretKey) return console.error('lack of param SecretKey');

  var getObjectKeys = function (obj) {
      var list = [];
      for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
              list.push(key);
          }
      }
      return list.sort();
  };

  var obj2str = function (obj) {
      var i, key, val;
      var list = [];
      var keyList = getObjectKeys(obj);
      for (i = 0; i < keyList.length; i++) {
          key = keyList[i];
          val = obj[key] || '';
          key = key.toLowerCase();
          list.push(camSafeUrlEncode(key) + '=' + camSafeUrlEncode(val));
      }
      return list.join('&');
  };

  // 签名有效起止时间
  var now = parseInt(new Date().getTime() / 1000) - 1;
  var exp = now;

  var Expires = opt.Expires || opt.expires;
  if (Expires === undefined) {
      exp += 900; // 签名过期时间为当前 + 900s
  } else {
      exp += (Expires * 1) || 0;
  }

  // 要用到的 Authorization 参数列表
  var qSignAlgorithm = 'sha1';
  var qAk = SecretId;
  var qSignTime = now + ';' + exp;
  var qKeyTime = now + ';' + exp;
  var qHeaderList = getObjectKeys(headers).join(';').toLowerCase();
  var qUrlParamList = getObjectKeys(queryParams).join(';').toLowerCase();

  // 签名算法说明文档：https://www.qcloud.com/document/product/436/7778
  // 步骤一：计算 SignKey
  var signKey = crypto.HmacSHA1(qKeyTime, SecretKey).toString();
  console.log(signKey);

  // 步骤二：构成 FormatString
  var formatString = [method, pathname, obj2str(queryParams), obj2str(headers), ''].join('\n');

  // 步骤三：计算 StringToSign
  var stringToSign = ['sha1', qSignTime, crypto.SHA1(formatString).toString(), ''].join('\n');

  // 步骤四：计算 Signature
  var qSignature = crypto.HmacSHA1(stringToSign, signKey).toString();

  // 步骤五：构造 Authorization
  var authorization = [
      'q-sign-algorithm=' + qSignAlgorithm,
      'q-ak=' + qAk,
      'q-sign-time=' + qSignTime,
      'q-key-time=' + qKeyTime,
      'q-header-list=' + qHeaderList,
      'q-url-param-list=' + qUrlParamList,
      'q-signature=' + qSignature
  ].join('&');

  return authorization;

};

function getParam(url, name) {
    var query, params = {}, index = url.indexOf('?');
    if (index >= 0) {
        query = url.substr(index + 1).split('&');
        query.forEach(function (v) {
            var arr = v.split('=');
            params[arr[0]] = arr[1];
        });
    }
    return params[name];
}

const imageCtrl = {};

imageCtrl.auth = function (req, res) {
  var method = getParam(req.url, 'method');
  var pathname = decodeURIComponent(getParam(req.url, 'pathname'));
  var auth = getAuth({
    method, 
    pathname,
  });
  console.log(method, pathname);
//   res.writeHead(200, {
//       'Content-Type': 'text/plain',
//       'Access-Control-Allow-Origin': '*',
//       'Access-Control-Allow-Methods': 'OPTIONS,GET,POST',
//       'Access-Control-Allow-Headers': 'accept,content-type',
//       'Access-Control-Max-Age': 60
//   });
  res.write(auth || '');
  res.end();
};

module.exports = imageCtrl;
