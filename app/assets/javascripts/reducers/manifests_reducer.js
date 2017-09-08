const manifestsReducer = (state = {}, action) => {
  switch (action.type) {
    case 'REMOVE_MANIFEST':
      let newState = {...state}
      delete newState[action.id]
      return newState
    case 'LOAD_MANIFESTS':
      return { ...state, ...action.manifestsById }
    case 'ADD_MANIFEST':
    case 'UPDATE_USER_MANIFEST':

      var obj = { ...state, [action.manifest.id]: action.manifest }
      return obj;
    default:
      return state
  }
}

export default manifestsReducer
