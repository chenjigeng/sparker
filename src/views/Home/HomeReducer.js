export const actionTypes = {
  'UPDATE_DOC_LIST': 'UPDATE_DOC_LIST',
  'LOGOUT': 'LOGOUT',
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
    case actionTypes.LOGOUT:
      return {
        ...state,
        docs: [],
      };
    default:
      return state;
  }
}

