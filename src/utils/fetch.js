export function myFetch(url, options) {
  return fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
  });
}
