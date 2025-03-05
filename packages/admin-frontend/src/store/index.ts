import { configureStore } from "@reduxjs/toolkit";
import updateUserSlice from "./update-user.slice";

const store = configureStore({
  reducer: {
    // Add the slice to the store
    updateUser: updateUserSlice.reducer,
  },
});

export default store;
