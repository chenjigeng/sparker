
export const actionTypes = {
  'UPDATE_DOC_LIST': 'UPDATE_DOC_LIST'
};

export function HomeReducer(state = {
  docs: [],
}, action) {
  console.log(action);
  switch (action.type) {
    case actionTypes.UPDATE_DOC_LIST:
      console.log('heihei');
      return {
        ...state,
        docs: action.payload.docs,
      };
    default:
      return state;
  }
}

