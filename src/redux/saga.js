import { put, all, call, takeEvery } from 'redux-saga/effects';
import { DocSaga } from '../views/Doc';
import { HomeSaga } from '../views/Home';
import * as Apis from '../Apis';
import * as actionTypes from './actionTypes';
import { SparkLoading } from '../SparkComponent';

export function* mainSaga() {
  yield takeEvery(actionTypes.LOGIN, loginSaga);
  yield takeEvery(actionTypes.REGIST, registSaga);
  yield all([call(DocSaga), call(HomeSaga)]);
  console.log('mainsaga');
}

export const actions = {
  requestLogin: (username, password) => {
    return {
      type: actionTypes.LOGIN,
      payload: { username, password }
    };
  },
  requestRegist: (username, password) => {
    return {
      type: actionTypes.REGIST,
      payload: { username, password }
    };
  }
};

function* loginSaga(action) {
  try {
    yield put({ type: actionTypes.LOGIN_REQUEST});
    SparkLoading.show();
    console.log(action);
    const { payload: { username, password } } = action;
    const result = yield Apis.Login(username, password).then(res => res.json());
    console.log(result);
    if (result.code === 200) {
      yield put({ 
        type: actionTypes.LOGIN_SUCCESS, 
        payload: {
          isLogin: true,
          userInfo: {
            username,
          }
        }
      });
    } else {
      yield put({
        type: actionTypes.LOGIN_FAILURE,
        payload: {
          isLogin: false
        }
      });
    }
    console.log(result);
  } catch (err) {
    console.log(err);
    yield put({
      type: actionTypes.LOGIN_FAILURE,
      payload: {
        isLogin: false
      }
    });
  }
  SparkLoading.hide();
}

function* registSaga(action) {
  try {
    const { payload: { username, password } } = action;
    const result = yield Apis.Login(username, password);
    console.log(result);
  } catch (err) {
    console.log(err);
  }
}
