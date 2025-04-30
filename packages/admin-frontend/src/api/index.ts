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

export class AdminZarApi {
  #ax: AxiosInstance;
  constructor(ax: AxiosInstance) {
    this.#ax = ax;
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
}

const ax = axios.create({ baseURL: "http://localhost:3007/admin" });
const adminZarApiInstance = new AdminZarApi(ax);

export default adminZarApiInstance;
