import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ILoginFormSchema } from "../schema/Login.schema";

type AdminApiInstance = InstanceType<typeof import("../api/index").AdminZarApi>;
type Extra = { extra: AdminApiInstance };
type AdminApiMethodReturn<T extends keyof AdminApiInstance> = ReturnType<
  AdminApiInstance[T]
>;

type RequestState = "idle" | "loading" | "success" | "failed";
export type AuthSlice = {
  user?: Record<string, unknown>;
  accessToken?: string;
  loginRequest: {
    state: RequestState;
  };
  refreshTokenRequest: {
    state: RequestState;
  };
};

const initialState: AuthSlice = {
  loginRequest: {
    state: "idle",
  },
  refreshTokenRequest: {
    state: "idle",
  },
};

export const adminLoginThunk = createAsyncThunk<
  Awaited<AdminApiMethodReturn<"login">>,
  ILoginFormSchema,
  Extra
>("auth/login-request", async function loginRequest(payload, { extra: api }) {
  const result = await api.login(payload);
  if (result.status === "success") {
    api.setAccessToken(result.data.accessToken);
  }
  return result;
});

export const adminRefreshTokenThunk = createAsyncThunk<
  Awaited<AdminApiMethodReturn<"refreshToken">>,
  undefined,
  Extra
>(
  "auth/refreshToken-request",
  async function refreshTokenRequest(_, { extra: api }) {
    const result = await api.refreshToken();
    if (result.status === "success") {
      api.setAccessToken(result.data.accessToken);
    }
    return result;
  }
);

export const authSlice = createSlice({
  name: "auth",
  reducers: {},
  initialState,
  extraReducers(builder) {
    builder
      .addCase(adminLoginThunk.pending, (state) => {
        state.loginRequest.state = "loading";
      })
      .addCase(adminLoginThunk.fulfilled, (state, action) => {
        if (action.payload.status === "success") {
          state.loginRequest.state = "success";
          state.accessToken = action.payload.data.accessToken;
          return;
        }
        state.loginRequest.state = "failed";
      })
      .addCase(adminLoginThunk.rejected, (state, action) => {
        console.log("Login Rejected", action);
        state.loginRequest.state = "failed";
      });

    builder
      .addCase(adminRefreshTokenThunk.pending, (state) => {
        console.log("1 set loading");
        state.refreshTokenRequest.state = "loading";
      })
      .addCase(adminRefreshTokenThunk.fulfilled, (state, action) => {
        console.log("2 set sc");
        state.refreshTokenRequest.state = "success";
        if (action.payload.status === "success") {
          state.accessToken = action.payload.data.accessToken;
          return;
        }
        state.loginRequest.state = "failed";
      })
      .addCase(adminRefreshTokenThunk.rejected, (state, action) => {
        console.log("RefreshToken request has just rejected", action);
        state.refreshTokenRequest.state = "failed";
      });
  },
});

export const authSliceActions = authSlice.actions;
