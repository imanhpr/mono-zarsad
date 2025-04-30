import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./auth.slice";
import adminZarApiInstance from "../api";

export const store = configureStore({
  devTools: true,
  reducer: { auth: authSlice.reducer },
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware({
      thunk: {
        extraArgument: adminZarApiInstance,
      },
    });
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = AppStore["dispatch"];
export type AppStore = typeof store;
