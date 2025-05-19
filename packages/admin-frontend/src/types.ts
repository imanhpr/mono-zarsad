export type User = Awaited<
  ReturnType<import("./api/index").AdminZarApi["getUserList"]>
>["users"][0];
