import { articleSlice } from "lib/pages/home/Feature/Article/slice";
import { combineReducers } from "redux";
import buttonReducer from "./buttonStatus";
import updateNameReducer from "./updateName";

export function createReducer(injectedReducers = {}) {

  return combineReducers({
    "profile/article": articleSlice.reducer,
    button: buttonReducer,
    name: updateNameReducer,
    ...injectedReducers,
  });
}

