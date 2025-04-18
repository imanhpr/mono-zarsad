import * as minio from "minio";
import fs from "node:fs";
import { join } from "node:path";
import process from "node:process";

const _dirname = import.meta.dirname;

// ARGS: URL AccessKey SecretKey BucketName

function validateArgs(input) {
  if (!input) throw new Error("Please Check your args");
  return input;
}
const SIMIN_URL = validateArgs(process.argv[2]);
const ACCESS_KEY = validateArgs(process.argv[3]);
const SECRET_KEY = validateArgs(process.argv[4]);

const BUCKET_NAME = validateArgs(process.argv[5]);
const objectStorage = new minio.Client({
  accessKey: ACCESS_KEY,
  secretKey: SECRET_KEY,
  endPoint: SIMIN_URL,
  region: "default",
  useSSL: true,
});

const rootName = ".";

const fileList = fs.globSync(join(_dirname, "dist", "**", "*"));

for (const filePath of fileList) {
  const [_, fileName] = filePath.split("dist");
  const res = fs.statSync(filePath);
  if (res.isFile() === false) continue;
  const fileBuffer = fs.readFileSync(filePath);
  const uploadResult = await objectStorage.putObject(
    BUCKET_NAME,
    join(rootName, fileName),
    fileBuffer,
    undefined
  );

  console.log(uploadResult);
}
