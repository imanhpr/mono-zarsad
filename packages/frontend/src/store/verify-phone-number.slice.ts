import { createSlice } from "@reduxjs/toolkit";

const initialState: { value?: string } = {};

export const phoneNumberSlice = createSlice({
  name: "phoneNumber",
  initialState,
  reducers: {
    insert(state, action) {
      state.value = action.payload;
    },
  },
});

export const phoneNumberSliceActions = phoneNumberSlice.actions;
