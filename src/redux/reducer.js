import { combineReducers } from 'redux';
import * as actionTypes from './actionTypes';

function commonInfoReducer(state = {
  isLogin: false,
  isLoading: false,
  userInfo: {},
}, action) {
  console.log(action);
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
      };
    }
    case actionTypes.LOGIN_FAILURE: {
      return {
        ...state,
        isLoading: false,
        ...action.payload
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
      };
    }
    case actionTypes.REGIST_FAILURE: {
      return {
        ...state,
        isLoading: false,
        ...action.payload
      };
    }
    default: {
      return state;
    }
  }
}

export default combineReducers({
  commonInfo: commonInfoReducer,
});
