import axios, { AxiosResponse, isAxiosError, type Axios } from "axios";
import { AccessToken, AccessTokenSchema } from "../schema/RefreshToken.schema";
import {
  LoginResponse,
  LoginResponseSchema,
} from "../schema/LoginResponse.schema";
import {
  RegisterResponse,
  RegisterResponseSchema,
} from "../schema/RegisterResponse.schema";

export class ZarAPI {
  #axios: Axios;
  constructor(axios: Axios) {
    this.#axios = axios;
  }

  setAccessToken(token: string | null) {
    if (token)
      return (this.#axios.defaults.headers.common["Authorization"] =
        `Bearer ${token}`);

    this.#axios.defaults.headers.common["Authorization"] = "";
  }
  async login(phoneNumber: string): Promise<LoginResponse | undefined> {
    try {
      const response = await this.#axios.post("/auth/login", {
        phoneNumber,
      });
      const parseResult = await LoginResponseSchema.parseAsync(response.data);
      return parseResult;
    } catch (err) {
      if (isAxiosError(err) && err.status === 400) {
        const parseResult = await LoginResponseSchema.parseAsync(
          err.response?.data
        );
        return parseResult;
      }
    }
  }
  async refresh(): Promise<AccessToken> {
    const response = await this.#axios.get("/auth/refresh", {
      withCredentials: true,
    });
    return AccessTokenSchema.parse(response.data);
  }

  async getMe() {
    const response = await this.#axios.get("/user/me");
    return response;
  }

  async logOut() {
    const response = await this.#axios.get("/auth/logout", {
      withCredentials: true,
    });
    return response;
  }

  async verify(phoneNumber: string, code: string): Promise<AccessToken> {
    const response = await this.#axios.post(
      "/auth/verify",
      {
        phoneNumber,
        code,
      },
      { withCredentials: true }
    );
    return AccessTokenSchema.parse(response.data);
  }

  async register(payload: {
    phoneNumber: string;
    firstName: string;
    lastName: string;
    nationalCode: string;
  }): Promise<RegisterResponse | undefined> {
    const response = await this.#axios.post("/auth/register", payload);
    if (response.status === 200) {
      const parseResult = await RegisterResponseSchema.parseAsync(
        response.data
      );
      if (parseResult.data.isOtpSend === true) return parseResult;
    }
  }

  async userInfo() {
    const response = await this.#axios.get("/user/info");
    return response.data;
  }

  async getCurrencyPriceByCurrencyTypeId(id: number) {
    const response = await this.#axios.get(
      `/currency?currency=${id}&isJalali=false`
    );
    console.log("response.data", response.data);
    return response.data;
  }

  async buyRequest(payload: any) {
    const response = await this.#axios.post("/transaction", payload);
    return response.data;
  }

  async get5LatestExchange() {
    const response = await this.#axios.get(
      "/transaction/report/latest-exchange"
    );
    return response.data;
  }

  async getTransactionReportById(transactionId: string) {
    const response = await this.#axios.get(
      `/transaction/${transactionId}/report`
    );
    return response.data;
  }

  async getTransactionInvoiceById(transactionId: string) {
    const response = await this.#axios.get(`/invoice/${transactionId}`);
    return response.data;
  }
}

const BASE_URL = import.meta.env.VITE_API_URL;
const ax = axios.create({ baseURL: BASE_URL });
export const zarApiInstance = new ZarAPI(ax);

export default zarApiInstance;
