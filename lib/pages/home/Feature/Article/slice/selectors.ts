import { createSelector } from "@reduxjs/toolkit";
import { initialState } from ".";
export const mySelector = (state: any) =>
  state?.[`profile/article`] || initialState;

// Here type of `someState` will be inferred ✅

const selectError = createSelector(
  mySelector,
  (articleState) => articleState.error
);
const selectArrayArticle = createSelector(
  mySelector,
  (articleState) => articleState.data
);

export { selectError, selectArrayArticle };
