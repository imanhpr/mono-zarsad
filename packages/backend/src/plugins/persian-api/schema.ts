import vine from "@vinejs/vine";
import { Infer } from "@vinejs/vine/types";

export const MeltedGoldGetResponseSchema = vine.object({
  result: vine.object({
    total: vine.number(),
    per_page: vine.number(),
    current_page: vine.number(),
    last_page: vine.number(),
    from: vine.number(),
    to: vine.number(),
    data: vine.array(
      vine.object({
        key: vine.number(),
        category: vine.string(),
        عنوان: vine.string(),
        قیمت: vine.string(),
        تغییر: vine.any(),
        بیشترین: vine.string(),
        کمترین: vine.string(),
        "تاریخ بروزرسانی": vine.string(),
      })
    ),
  }),
});

export type IMeltedGoldGetResponseSchema = Infer<
  typeof MeltedGoldGetResponseSchema
>;
