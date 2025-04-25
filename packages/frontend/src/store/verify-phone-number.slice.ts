import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type PhoneNumberStateType = {
  value?: string;
};
const initialState: PhoneNumberStateType = {};

export const phoneNumberSlice = createSlice({
  name: "phoneNumber",
  initialState,
  reducers: {
    insert(state, action: PayloadAction<string>) {
      state.value = action.payload;
    },
  },
});

export const phoneNumberSliceActions = phoneNumberSlice.actions;
