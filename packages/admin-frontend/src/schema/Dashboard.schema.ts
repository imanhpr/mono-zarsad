import { z } from "zod";
type TransactionType = "EXCHANGE" | "WALLET_TO_WALLET" | "SIMPLE" | "ALL";

export const DashboardPageInfoSchema = z.object({
  userCountInfo: z.object({
    growthPercentage: z.number(),
    currentUserCount: z.number(),
    lastWeekUserCount: z.number(),
  }),
  walletTransactionInfo: z.array(
    z.object({
      type: z.enum([
        "ALL",
        "EXCHANGE",
        "SIMPLE",
        "WALLET_TO_WALLET",
      ] as const satisfies TransactionType[]),
      count: z.string(),
    })
  ),
});

export type IDashboardPageInfoSchema = z.infer<typeof DashboardPageInfoSchema>;
