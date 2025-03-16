import { configureStore } from "@reduxjs/toolkit";
import updateUserSlice from "./update-user.slice";
import { userAuthSlice } from "./auth.slice";

const store = configureStore({
  reducer: {
    // Add the slice to the store
    updateUser: updateUserSlice.reducer,
    userAuth: userAuthSlice.reducer,
  },
});

export default store;
