import { type Axios } from "axios";

export default class ZarAPI {
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
  async login(phoneNumber: string, captchaToken: string) {
    const response = await this.#axios.post("/auth/login", {
      phoneNumber,
      "arcaptcha-token": captchaToken,
    });
    console.log(response.data);
  }
  async refresh() {
    const response = await this.#axios.get("/auth/refresh", {
      withCredentials: true,
    });
    return response;
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

  async verify(phoneNumber: string, code: string) {
    const response = await this.#axios.post(
      "/auth/verify",
      {
        phoneNumber,
        code,
      },
      { withCredentials: true }
    );
    return response;
  }
}
