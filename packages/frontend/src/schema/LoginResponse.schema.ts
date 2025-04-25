import { z } from "zod";
import {
  phoneNumberNormalizer,
  phoneNumberValidator,
} from "@persian-tools/persian-tools";

export const LoginResponseSchema = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("success"),
    message: z.string(),
    data: z.object({
      isOtpSend: z.boolean(),
    }),
  }),
  z.object({
    status: z.literal("failed"),
    message: z.string(),
    data: z.object({ phoneNumber: z.string() }),
  }),
]);
const phoneValidator = z.custom<string>(
  (rawPhoneNumber) => {
    if (typeof rawPhoneNumber === "string") {
      const res = phoneNumberValidator(rawPhoneNumber);
      return res;
    }

    return false;
  },
  () => {
    return { message: "لطفا یک شماره موبایل معتبر وارد کنید" };
  }
);
export const LoginRequestPayloadSchema = z.object({
  phoneNumber: phoneValidator.transform((phoneNumber) => {
    return phoneNumberNormalizer(phoneNumber, "+98");
  }),
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;
