import { actionTypes } from '../views/Home/HomeReducer';

export default {
  LOGIN: 'LOGIN',
  LOGIN_REQUEST: 'LOGIN_REQUEST',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',

  REGIST: 'REGIST',
  REGIST_REQUEST: 'REGIST_REQUEST',
  REGIST_SUCCESS: 'REGIST_SUCCESS',
  REGIST_FAILURE: 'REGIST_FAILURE',

  CHECK_LOGIN: 'CHECK_LOGIN',

  LOGOUT: 'LOGOUT',

  ...actionTypes,
};
