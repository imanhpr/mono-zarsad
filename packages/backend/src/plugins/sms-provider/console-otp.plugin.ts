import { IOtpSender } from "./types.ts";

export class ConsoleOtpSender implements IOtpSender {
  constructor() {}
  async sendOTP(code: number): Promise<boolean> {
    console.log("Code:", code);
    return true;
  }
}
