import { Type, Static, FormatRegistry } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

FormatRegistry.Set("safeInt", (v) => {
  const parsedInt = Number.parseInt(v);
  return Number.isFinite(parsedInt) && Number.isSafeInteger(parsedInt);
});

export const GenericIdParam = Type.Object({
  id: Type.String({ format: "safeInt" }),
});

export type IGenericIdParam = Static<typeof GenericIdParam>;
