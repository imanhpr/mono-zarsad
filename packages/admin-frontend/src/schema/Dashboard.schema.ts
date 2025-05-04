import { z } from "zod";

export const DashboardPageInfoSchema = z.object({
  userCountInfo: z.object({
    growthPercentage: z.number(),
    currentUserCount: z.number(),
    lastWeekUserCount: z.number(),
  }),
});

export type IDashboardPageInfoSchema = z.infer<typeof DashboardPageInfoSchema>;
