import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { Bot, webhookCallback } from "grammy";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.post("/telehook", async (c) => {
  const bot = new Bot(c.env.BOT_API_TOKEN);
  bot.command("start", async (ctx) => {
    await ctx.reply(
      `Hello ${ctx.from?.first_name || ctx.from?.id} your chatid is:\n${ctx.chatId}`
    );
    console.log("user chat id :", ctx.chatId);
  });
  const telegramWebHook = webhookCallback(bot, "hono");
  return await telegramWebHook(c);
});

const NotificationSchema = z.object({ type: z.string(), body: z.string() });

app.get("/", (c) => {
  return c.text("Hello");
});

app.post(
  "/notif",
  async (c, next) => {
    const MAIN_API_KEY = c.env.CLIENT_API_KEY;
    const apiKey = c.req.header("api-key");
    if (!apiKey)
      return c.json(
        { status: "failed", message: "api-key header not found" },
        400
      );

    const encoder = new TextEncoder();
    const mainKeyBuffer = encoder.encode(MAIN_API_KEY);
    const inputKey = encoder.encode(apiKey);
    try {
      if (crypto.subtle.timingSafeEqual(mainKeyBuffer, inputKey)) {
        return await next();
      }
      return c.json({ status: "failed", message: "invalid api key" }, 403);
    } catch {
      return c.json({ status: "failed", message: "invalid api key" }, 403);
    }
  },
  zValidator("json", NotificationSchema, (result, c) => {
    if (!result.success) {
      return c.text("invalid", 400);
    }
  }),

  async (c) => {
    const body = await c.req.json();
    const bot = new Bot(c.env.BOT_API_TOKEN);
    await bot.api.sendMessage(c.env.GROUP_CHAT_ID, await c.req.text());
    return c.json(body);
  }
);

export default app;
