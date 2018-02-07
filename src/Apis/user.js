import { myFetch } from '../utils';

export function Login(username, password) {
  return myFetch('/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  });
}
