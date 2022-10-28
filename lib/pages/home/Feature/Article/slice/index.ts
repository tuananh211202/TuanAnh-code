import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { persistor } from "lib/store/configureStore";
import { IArticle } from "lib/types/article";
import moment from "moment";
import { useInjectReducer } from "redux-injectors";
import { ArticleState } from "./types";

export const initialState: ArticleState = {
  persistExpiresAt: moment().add(-11, "m").format(),
  data: [],
  error: null,
};

export const articleSlice = createSlice({
  name: "profile/article",
  initialState,
  reducers: {
    setListArticle: (state, actions: PayloadAction<IArticle>) => {
      state.error = "null";
      state.data = [...state.data, actions.payload];
    },
    removeArticle: (state, actions: PayloadAction<IArticle>) => {
      state.error = "null";
      state.data = state.data.filter((item) => {
        return item.id !== actions.payload.id;
      });
    },
  },
});

// Action creators are generated for each case reducer function

export const { actions: tagArticleAction, reducer } = articleSlice;
// export const useArticleSlice = () => {
//   useInjectReducer({ key: articleSlice.name, reducer: articleSlice.reducer });
//   // useInjectSaga({ key: tagTypeSlice.name, saga: newRequestSaga });
//   return { actions: articleSlice.actions };
// };
export const { setListArticle } = articleSlice.actions;
