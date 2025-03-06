import { format } from "date-fns-jalali";
import { randomInt } from "node:crypto";

export async function randInt(min: number, max: number): Promise<number> {
  const { promise, reject, resolve } = Promise.withResolvers<number>();

  randomInt(min, max, (err, value) => {
    if (err) return reject(err);
    resolve(value);
  });
  return promise;
}

export function mapDateToJalali<T extends { createdAt: Date }>(
  input: T[]
): T[] {
  return input.map((data) => {
    return Object.assign(data, {
      createdAt: format(new Date(data.createdAt), "yyyy-MM-dd EEEE HH:mm:ss"),
    });
  });
}
