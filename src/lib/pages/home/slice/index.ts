import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";
import { useInjectReducer } from "redux-injectors";

export const initialState = {
  persistExpiresAt: moment().add(-11, "m").format(),
  tag_type_0: [],
  tag_type_1: [],
  tag_type_2: [],
};

export const tagTypeSlice = createSlice({
  name: "tagType",
  initialState,
  reducers: {
    setTagType: (state, action) => {
      return { ...action.payload };
    },
  },
});

// Action creators are generated for each case reducer function

export const { actions: tagTypeAction, reducer } = tagTypeSlice;
// export const useTagTypeSlice = () => {
//   useInjectReducer({ key: tagTypeSlice.name, reducer: tagTypeSlice.reducer });
//   // useInjectSaga({ key: tagTypeSlice.name, saga: newRequestSaga });
//   return { actions: tagTypeSlice.actions };
// };
