import { configureStore } from "@reduxjs/toolkit";
import { phoneNumberSlice } from "./verify-phone-number.slice";

export const store = configureStore({
  devTools: true,
  reducer: { phoneNumber: phoneNumberSlice.reducer },
});
