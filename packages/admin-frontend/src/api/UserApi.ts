import { AxiosInstance } from "axios";
import { IUser } from "../types";

interface ICreateNewUserPayload {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  nationalCode: string;
}

export default class UserAPI {
  #axios: AxiosInstance;
  constructor(axios: AxiosInstance) {
    this.#axios = axios;
  }

  createNew(payload: ICreateNewUserPayload) {
    return this.#axios.post("admin/user", payload);
  }
  async findLatestUsers(): Promise<IUser[]> {
    const result = await this.#axios.get("admin/user");

    return result.data;
  }

  async updateUserById(userId: number, data: object) {
    const p = {
      user: {
        firstName: data.firstName,
        lastName: data.lastName,
        nationalCode: data.nationalCode,
        phoneNumber: data.phoneNumber,
      },

      profile: {
        debtPrem: data.debtPrem,
      },
    };
    const result = await this.#axios.put(`admin/user/${userId}`, p);
    return result.data;
  }
}
