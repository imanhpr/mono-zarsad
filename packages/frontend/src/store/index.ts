import { configureStore } from "@reduxjs/toolkit";
import { phoneNumberSlice } from "./verify-phone-number.slice";
import { authSlice } from "./auth.slice";
import zarApiInstance from "../api";

export const store = configureStore({
  devTools: true,
  reducer: { phoneNumber: phoneNumberSlice.reducer, auth: authSlice.reducer },
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware({
      thunk: {
        extraArgument: zarApiInstance,
      },
    });
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = AppStore["dispatch"];
export type AppStore = typeof store;
