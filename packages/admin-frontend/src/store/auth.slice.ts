import { createSlice } from "@reduxjs/toolkit";
import { IUser } from "../types";

const initialState: { currentUser?: IUser; accessToken?: string } = {};

export const userAuthSlice = createSlice({
  name: "userAuth",
  reducers: {
    setAccessToken(state, action) {
      state.accessToken = action.payload;
    },
    setUser(state, action: { payload?: IUser }) {
      state.currentUser = action.payload;
    },
  },
  initialState,
});

export const userAuthActions = userAuthSlice.actions;
