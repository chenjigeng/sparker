import { myFetch } from '../utils';

export function createDoc() {
  return myFetch('/api/doc', {
    method: 'POST'
  });
}
