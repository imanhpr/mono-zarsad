import { format } from "date-fns-jalali";
import { Decimal } from "decimal.js";
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

export const GOLD_CONST = new Decimal("4.331802");

export class BusinessOperationResult<T extends unknown> {
  public readonly status: "success" | "failed";
  public readonly message: string;
  public readonly data: T;

  constructor(status: "success" | "failed", message: string, data: T) {
    this.status = status;
    this.message = message;
    this.data = data;
  }
}
