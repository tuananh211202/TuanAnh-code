const buttonReducer = (state = { save: {avatar: 0, section: 0}, cancel: {avatar: 0, section: 0}}, action) => {
  switch (action.type) {
    case "save_Avatar":
      return {
        ...state,
        save: {
          ...state.save,
          avatar: 1 - state.save.avatar,
        }
      };
    case "save_Section":
      return {
        ...state,
        save: {
          ...state.save,
          section: 1 - state.save.section,
        }
      }
    case "cancel_Avatar":
      return {
        ...state,
        cancel: {
          ...state.cancel,
          avatar: 1 - state.cancel.avatar,
        }
      }
    case "cancel_Section":
      return {
        ...state,
        cancel: {
          ...state.cancel,
          section: 1 - state.cancel.section,
        }
      }
    default: 
      return state;
  }
}

export default buttonReducer;
