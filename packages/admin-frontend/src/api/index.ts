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
import {
  GetLatestCurrencyPriceListSchema,
  IGetLatestCurrencyPriceListSchema,
} from "../schema/CurrencyLatest.schema";
import {
  CurrentActiveSpreadResponseSchema,
  ICurrentActiveSpreadResponseSchema,
} from "../schema/Spread.schema";
import {
  CreateNewUserResponseSchema,
  ICreateNewUserRequestPayloadSchema,
  ICreateNewUserResponseSchema,
} from "../schema/User.schema";

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

  async getLatestCurrency(
    limit: number,
    currencyTypeId: number,
    orderBy: "ASC" | "DESC"
  ): Promise<IGetLatestCurrencyPriceListSchema> {
    const query = new URLSearchParams();
    query.set("limit", limit.toString());
    query.set("currencyTypeId", currencyTypeId.toString());
    query.set("orderBy", orderBy);

    const response = await this.#ax.get(`/currency/latest?${query.toString()}`);
    const result = await GetLatestCurrencyPriceListSchema.parseAsync(
      response.data
    );
    return result;
  }

  async getActiveSpread(): Promise<ICurrentActiveSpreadResponseSchema> {
    const response = await this.#ax.get("/spread/current");
    const result = await CurrentActiveSpreadResponseSchema.parseAsync(
      response.data
    );
    return result;
  }

  async createNewUser(
    payload: ICreateNewUserRequestPayloadSchema
  ): Promise<ICreateNewUserResponseSchema> {
    try {
      const response = await this.#ax.post("/user", payload);
      if (response.status === 201) {
        const result = await CreateNewUserResponseSchema.parseAsync(
          response.data
        );
        return result;
      }
      throw new Error("Validation Has Just Failed - code 1023-EWSXEQ");
    } catch (err) {
      if (isAxiosError(err)) {
        const result = await CreateNewUserResponseSchema.parseAsync(
          err.response?.data
        );
        return result;
      }
      throw err;
    }
  }
}

const ax = axios.create({ baseURL: "http://localhost:3007/admin" });
const adminZarApiInstance = new AdminZarApi(ax);

export default adminZarApiInstance;
