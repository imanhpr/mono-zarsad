import type { AxiosInstance } from "axios";
import { adminLoginAuthResponse, IAdminSchemaPayload } from "../schema";

export class AuthApi {
  #axios: AxiosInstance;
  constructor(axios: AxiosInstance) {
    this.#axios = axios;
  }

  async login(payload: IAdminSchemaPayload) {
    const response = await this.#axios.post("/admin/auth/login", payload);

    if (response.status === 200) {
      const { token } = await adminLoginAuthResponse.parseAsync(response.data);
      return token;
    }
    console.log("Login Auth Response : ", response.data, response.status);
    throw new Error("Invalid Login");
  }

  logout() {}

  async me(accessToken: string) {
    const response = await this.#axios.get("/admin/auth/me", {
      headers: { Authorization: "Bearer " + accessToken },
    });

    return response.data;
  }
}
