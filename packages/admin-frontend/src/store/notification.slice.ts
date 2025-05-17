import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Notification = {
  id: string;
  message: string;
  status: "info" | "success" | "error";
  duration: number;
};
type InitState = {
  notifications: Notification[];
};

const initialState: InitState = { notifications: [] };

export const notificationSlice = createSlice({
  name: "notification",
  reducers: {
    addNotification(state, action: PayloadAction<Notification>) {
      state.notifications.push(action.payload);
    },

    removeNotificationByKey(state, action: PayloadAction<string>) {
      state.notifications = state.notifications.filter(
        (item) => item.id !== action.payload
      );
    },
  },
  initialState,
});

export const notificationSliceAction = notificationSlice.actions;
