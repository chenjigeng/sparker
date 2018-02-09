import { myFetch } from '../utils';

export function Login(username, password) {
  return myFetch('/api/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  });
}

export function Regist(username, password) {
  return myFetch('/api/regist', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  });
}
