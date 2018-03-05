
export const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export function* DocSaga() {
  yield delay(10000);
}
