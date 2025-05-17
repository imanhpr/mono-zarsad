import { z } from "zod";

export const CreateNewUserRequestPayloadSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z
    .string()
    .trim()
    .length(11, "شماره تلفن نمیتواند بیشتر یا کمتر از 11 عدد باشد")
    .regex(/^\d+$/, "شماره موبایل باید عدد باشد.")
    .startsWith("09", 'شماره موبایل باید با "09" شروع شود.')
    .transform((item) => item.replace("0", "+98")),
  nationalCode: z
    .string()
    .trim()
    .length(10, { message: "کد ملی باید 10 عدد باشد" }),
});

export type ICreateNewUserRequestPayloadSchema = z.infer<
  typeof CreateNewUserRequestPayloadSchema
>;

export const CreateNewUserResponseSchema = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("success"),
    message: z.string(),
    data: z.object({
      id: z.number(),
      firstName: z.string(),
      lastName: z.string(),
      nationalCode: z.string(),
      phoneNumber: z.string(),
    }),
  }),
  z.object({
    status: z.literal("failed"),
    message: z.string(),
    data: z.object({
      firstName: z.string(),
      lastName: z.string(),
      phoneNumber: z.string(),
      nationalCode: z.string(),
    }),
  }),
]);

export type ICreateNewUserResponseSchema = z.infer<
  typeof CreateNewUserResponseSchema
>;
