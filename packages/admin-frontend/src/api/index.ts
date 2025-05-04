import axios, { isAxiosError, type AxiosInstance } from "axios";
import {
  ILoginFormSchema,
  ILoginResponseSchema,
  LoginResponseSchema,
} from "../schema/Login.schema";
import {
  IRefreshTokenResponseSchema,
  RefreshTokenResponseSchema,
} from "../schema/RefreshToken.schema";
import {
  DashboardPageInfoSchema,
  IDashboardPageInfoSchema,
} from "../schema/Dashboard.schema";

export class AdminZarApi {
  #ax: AxiosInstance;
  constructor(ax: AxiosInstance) {
    this.#ax = ax;
  }

  setAccessToken(token: string | null) {
    if (token)
      return (this.#ax.defaults.headers.common["Authorization"] =
        `Bearer ${token}`);

    this.#ax.defaults.headers.common["Authorization"] = "";
  }
  async login(payload: ILoginFormSchema): Promise<ILoginResponseSchema> {
    try {
      const response = await this.#ax.post("/auth/login", payload, {
        withCredentials: true,
      });
      const parseResult = LoginResponseSchema.parse(response.data);
      return parseResult;
    } catch (err) {
      if (isAxiosError(err)) {
        const parseResult = LoginResponseSchema.parse(err.response?.data);
        return parseResult;
      }
      throw err;
    }
  }

  async refreshToken(): Promise<IRefreshTokenResponseSchema> {
    try {
      const response = await this.#ax.get("/auth/refresh", {
        withCredentials: true,
      });
      const parseResult = RefreshTokenResponseSchema.parse(response.data);
      return parseResult;
    } catch (err) {
      if (isAxiosError(err)) {
        const parseResult = RefreshTokenResponseSchema.parse(
          err.response?.data
        );
        return parseResult;
      }
      throw err;
    }
  }

  async dashBoardInfo(): Promise<IDashboardPageInfoSchema> {
    const response = await this.#ax.get("/page/dashboard");
    const parse = await DashboardPageInfoSchema.parseAsync(response.data);
    return parse;
  }
}

const ax = axios.create({ baseURL: "http://localhost:3007/admin" });
const adminZarApiInstance = new AdminZarApi(ax);

export default adminZarApiInstance;
