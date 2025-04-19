import axios from "axios";
import fp from "fastify-plugin";
import { IOtpSender } from "./types.ts";

export class MelipayamakApi implements IOtpSender {
  constructor() {}
  #messageId = 222763;
  #apiKey = "a6497aa2809d4dc3b78cfbd44b661e81";
  #API_URL = `https://console.melipayamak.com/api/send/shared/${this.#apiKey}`;
  #headers = {
    headers: { "Content-Type": "application/json" },
  };
  async sendOTP(code: number, to: string) {
    const payload = {
      bodyId: this.#messageId,
      to,
      args: [code.toString()],
    };
    try {
      const result = await axios.post(
        this.#API_URL,
        JSON.stringify(payload),
        this.#headers
      );
      if (result.status === 200) return true;
      return false;
    } catch {
      return false;
    }
  }
}
