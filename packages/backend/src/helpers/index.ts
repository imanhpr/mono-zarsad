import { randomInt } from "node:crypto";

export async function randInt(min: number, max: number): Promise<number> {
  const { promise, reject, resolve } = Promise.withResolvers<number>();

  randomInt(min, max, (err, value) => {
    if (err) return reject(err);
    resolve(value);
  });
  return promise;
}
