import { createSlice } from "@reduxjs/toolkit";
import { IUser } from "../types";

const initialState: {
  user?: IUser;
} = {};
const updateUserSlice = createSlice({
  name: "updateUser",
  initialState,
  reducers: {
    updateUserRequest: (state, action) => {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = undefined;
    },
  },
});
export const updateUserSliceActions = updateUserSlice.actions;
export default updateUserSlice;
