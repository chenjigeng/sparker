export function objToCamcelCase(obj) {
  let newObj;
  if (Object.prototype.toString.call(obj) === '[object Array]') {
    newObj = [];
  } else if (Object.prototype.toString.call(obj) === '[object Object]') {
    newObj = {};
  }
  for (let key in obj) {
    const newKey = key.replace(/_./gi, (str) => {
      return str[1].toUpperCase();
    });
    if (typeof obj[key] === 'object') {
      newObj[newKey] = objToCamcelCase(obj[key]);
    } else {
      newObj[newKey] = obj[key];      
    }
  }
  return newObj;
}
