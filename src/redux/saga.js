import { put, all, call, takeEvery } from 'redux-saga/effects';
import { DocSaga } from '../views/Doc';
import { HomeSaga } from '../views/Home';
import * as Apis from '../Apis';
import * as actionTypes from './actionTypes';
import { SparkLoading, message } from '../SparkComponent';

export function* mainSaga() {
  yield takeEvery(actionTypes.LOGIN, loginSaga);
  yield takeEvery(actionTypes.REGIST, registSaga);
  yield all([call(DocSaga), call(HomeSaga)]);
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
    const { payload: { username, password } } = action;
    const result = yield Apis.Login(username, password).then(res => res.json());
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
      message.success('登录成功');
    } else {
      yield put({
        type: actionTypes.LOGIN_FAILURE,
        payload: {
          isLogin: false
        }
      });
      message.error(result.msg);
    }
  } catch (err) {
    yield put({
      type: actionTypes.LOGIN_FAILURE,
      payload: {
        isLogin: false
      }
    });
    message.error(err.msg || err.message || err);
  }
  SparkLoading.hide();
}

function* registSaga(action) {
  try {
    yield put({ type: actionTypes.REGIST_REQUEST});
    SparkLoading.show();
    const { payload: { username, password } } = action;
    const result = yield Apis.Regist(username, password).then(res => res.json());
    if (result.code === 200) {
      yield put({ 
        type: actionTypes.REGIST_SUCCESS, 
        payload: {
          isLogin: true,
          userInfo: {
            username,
          }
        }
      });
      message.success('注册成功');
    } else {
      yield put({
        type: actionTypes.REGIST_FAILURE,
        payload: {
          isLogin: false
        }
      });
      message.error(result.msg);
    }
  } catch (err) {
    yield put({
      type: actionTypes.REGIST_FAILURE,
      payload: {
        isLogin: false
      }
    });
    message.error(err.msg || err.message || err);
  }
  SparkLoading.hide();
}
