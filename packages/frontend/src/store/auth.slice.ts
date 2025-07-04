import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ZarAPI } from "../api/index";

export type AuthState = {
  user?: {
    id: number;
    firstName: string;
    lastName: string;
  };
  accessToken?: string;
  status: "loading" | "idle" | "success";
  verifyLoginThunkState: "loading" | "idle" | "success";
};

export const refreshAccessToken = createAsyncThunk<
  Awaited<ReturnType<InstanceType<typeof ZarAPI>["refresh"]>>,
  void,
  { extra: InstanceType<typeof ZarAPI> }
>("auth/refreshAccessToken", async (_, { extra: zarApi }) => {
  const res = await zarApi.refresh();
  if (res.status === "success") {
    zarApi.setAccessToken(res.data.accessToken);
  }
  return res;
});

export const verifyLoginRequest = createAsyncThunk<
  Awaited<ReturnType<InstanceType<typeof ZarAPI>["verify"]>>,
  { phoneNumber: string; code: string },
  { extra: InstanceType<typeof ZarAPI> }
>(
  "auth/verify-login-request",
  async ({ phoneNumber, code }, { extra: zarApi }) => {
    const res = await zarApi.verify(phoneNumber, code);
    if (res.status === "success") {
      zarApi.setAccessToken(res.data.accessToken);
    }
    return res;
  }
);
const initialState: AuthState = {
  status: "idle",
  verifyLoginThunkState: "idle",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<Pick<AuthState, "user">["user"]>) {
      state.user = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(refreshAccessToken.pending, (state) => {
        state.status = "loading";
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.status = "success";
        if (action.payload.status === "success")
          state.accessToken = action.payload.data.accessToken;
        else state.accessToken = undefined;
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        state.status = "success";
      });

    builder
      .addCase(verifyLoginRequest.pending, (state) => {
        state.verifyLoginThunkState = "loading";
      })
      .addCase(verifyLoginRequest.fulfilled, (state, action) => {
        state.verifyLoginThunkState = "success";
        if (action.payload.status === "success")
          state.accessToken = action.payload.data.accessToken;
        else state.accessToken = undefined;
      })
      .addCase(verifyLoginRequest.rejected, (state) => {
        state.verifyLoginThunkState = "success";
      });
  },
});

export const authSliceActions = authSlice.actions;
