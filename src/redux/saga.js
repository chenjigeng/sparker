import { put, all, call, takeEvery } from 'redux-saga/effects';
import { DocSaga } from '../views/Doc';
import { HomeSaga } from '../views/Home';
import * as Apis from '../Apis';
import actionTypes from './actionTypes';
import { SparkLoading, message } from '../SparkComponent';
import { objToCamcelCase } from '../utils';

export function* mainSaga() {
  yield takeEvery(actionTypes.LOGIN, loginSaga);
  yield takeEvery(actionTypes.REGIST, registSaga);
  yield takeEvery(actionTypes.CHECK_LOGIN, checkLoginAndFetch);
  yield takeEvery(actionTypes.LOGOUT, Logout);
  yield all([call(DocSaga), call(HomeSaga)]);
}

export const actions = {
  requestLogin: (username, password) => {
    return {
      type: actionTypes.LOGIN,
      payload: { username, password }
    };
  },
  requestLogout: () => {
    return {
      type: actionTypes.LOGOUT,
    };
  },
  requestRegist: (username, password) => {
    return {
      type: actionTypes.REGIST,
      payload: { username, password }
    };
  },
  requestCheckLogin: () => {
    return {
      type: actionTypes.CHECK_LOGIN
    };
  },
};

function* loginSaga(action) {
  try {
    yield put({ type: actionTypes.LOGIN_REQUEST});
    SparkLoading.show();
    const { payload: { username, password } } = action;
    const result = objToCamcelCase(yield Apis.Login(username, password).then(res => res.json()));
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
      yield put({
        type: actionTypes.UPDATE_DOC_LIST,
        payload: {
          docs: result.docs,
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
    const result = objToCamcelCase(yield Apis.Regist(username, password).then(res => res.json()));
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

function* checkLoginAndFetch() {
  try {
    SparkLoading.show();
    const result = objToCamcelCase(yield Apis.CheckAndFetch().then(res => res.json()));
    if (result.code === 200) {
      yield put({
        type: actionTypes.LOGIN_SUCCESS,
        payload: {
          isLogin: true,
          userInfo: {
            username: result.username,
          }
        }
      });
      yield put({
        type: actionTypes.UPDATE_DOC_LIST,
        payload: {
          docs: result.docs,
        }
      });
    } else {
      yield put({
        type: actionTypes.LOGIN_FAILURE,
        payload: {
          isFetching: false,
        }
      });
    }
  } catch (err) {
    yield put({
      type: actionTypes.LOGIN_FAILURE,
      payload: {
        isFetching: false,
      }
    });
  }
  SparkLoading.hide();
}

function *Logout() {
  try {
    const result = objToCamcelCase(yield Apis.Logout().then(res => res.json()));
    if (result.code === 200) {
      yield put({
        type: actionTypes.LOGOUT_SUCCESS,
      });
      message.success('登出成功');
    } else {
      message.error('登出失败');      
    }
  } catch (err) {
    message.error('登出失败');
  }
}
