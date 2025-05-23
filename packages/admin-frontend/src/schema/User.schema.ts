import { z } from "zod";

export const User = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  nationalCode: z.string(),
  phoneNumber: z.string(),
});

export type IUser = z.infer<typeof User>;

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
    data: User,
  }),
  z.object({
    status: z.literal("failed"),
    message: z.string(),
    data: User.pick({
      firstName: true,
      lastName: true,
      phoneNumber: true,
      nationalCode: true,
    }),
  }),
]);

export type ICreateNewUserResponseSchema = z.infer<
  typeof CreateNewUserResponseSchema
>;

const UserProfile = z.object({ id: z.number(), debtPrem: z.boolean() });
export type IUserProfile = z.infer<typeof UserProfile>;

const PaginationSchema = z.object({
  count: z.number(),
  offset: z.number(),
  limit: z.number(),
});

export const UserListResponse = z.object({
  status: z.literal("success"),
  message: z.string(),
  data: z.object({
    users: z.array(
      User.extend({ profile: UserProfile, createdAt: z.string().datetime() })
    ),
  }),
});

export type IUserListResponse = z.infer<typeof UserListResponse>;

export const UserListResponseWithPagination = z.object({
  status: z.literal("success"),
  message: z.string(),
  data: PaginationSchema.extend({
    users: z.array(
      User.extend({ profile: UserProfile, createdAt: z.string().datetime() })
    ),
  }),
});

const CurrencyTypeSchema = z.object({
  id: z.number(),
  name: z.string(),
  name_farsi: z.string(),
});

const WalletSchema = z.object({
  id: z.number(),
  currencyType: CurrencyTypeSchema,
  amount: z.string(),
  lockAmount: z.string(),
});

export const UserWithWallet = z.object({
  status: z.literal("success"),
  message: z.string(),
  data: z.object({
    count: z.number(),
    users: z.array(
      User.extend({
        wallets: z.array(WalletSchema),
        profile: UserProfile,
        createdAt: z.string().datetime(),
      })
    ),
  }),
});

export type IUserWithWallet = z.infer<typeof UserWithWallet>;
