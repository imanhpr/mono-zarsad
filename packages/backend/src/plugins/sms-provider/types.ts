export interface IOtpSenderConstructor {
  new (): IOtpSender;
}

export interface IOtpSender {
  sendOTP(code: number, to: string): Promise<boolean>;
}
