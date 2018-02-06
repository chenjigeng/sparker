
export const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export function* sayDoc() {
  yield delay(10000);
  console.log('hello doc');
}
