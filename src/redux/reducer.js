import { combineReducers } from 'redux';
import actionTypes from './actionTypes';
import { HomeReducer } from '../views/Home/HomeReducer';

function commonInfoReducer(state = {
  isLogin: false,
  isLoading: false,
  userInfo: {},
  isFetching: true,
}, action) {
  switch(action.type) {
    case actionTypes.LOGIN_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actionTypes.LOGIN_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        ...action.payload,
        isFetching: false,
      };
    }
    case actionTypes.LOGIN_FAILURE: {
      return {
        ...state,
        isLoading: false,
        ...action.payload
      };
    }
    case actionTypes.LOGOUT_SUCCESS: {
      return {
        ...state,
        isLogin: false,
        userInfo: null,
        isFetching: false,
      };
    }
    case actionTypes.REGIST_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case actionTypes.REGIST_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        ...action.payload,
        isFetching: false,
      };
    }
    case actionTypes.REGIST_FAILURE: {
      return {
        ...state,
        isLoading: false,
        ...action.payload,
        isFetching: false,
      };
    }
    default: {
      return state;
    }
  }
}

export default combineReducers({
  commonInfo: commonInfoReducer,
  homeInfo: HomeReducer,
});
