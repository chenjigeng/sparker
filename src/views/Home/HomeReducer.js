export const actionTypes = {
  'UPDATE_DOC_LIST': 'UPDATE_DOC_LIST',
  'LOGOUT': 'LOGOUT',
  'LOGOUT_SUCCESS': 'LOGOUT_SUCCESS',
  'CREATE_DOC': 'CREATE_DOC',
  'CREATE_DOC_REQUEST': 'CREATE_DOC_REQUEST',
  'CREATE_DOC_SUCCESS': 'CREATE_DOC_SUCCESS',
  'CREATE_DOC_FAILURE': 'CREATE_DOC_FAILURE',
};

export function HomeReducer(state = {
  docs: [],
}, action) {
  switch (action.type) {
    case actionTypes.UPDATE_DOC_LIST:
      return {
        ...state,
        docs: action.payload.docs,
      };
    case actionTypes.LOGOUT_SUCCESS:
      return {
        ...state,
        docs: [],
      };
    default:
      return state;
  }
}

