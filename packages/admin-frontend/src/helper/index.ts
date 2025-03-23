export function isNumericString(input: unknown): input is string {
  const rgx = /^\d*\.?(\d+)?$/;
  if (typeof input === "string") {
    return rgx.test(input);
  }
  return false;
}
