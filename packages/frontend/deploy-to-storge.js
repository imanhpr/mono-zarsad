import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fs from "node:fs";
import { extname, join } from "node:path";
import mime from "mime";
const _dirname = import.meta.dirname;
console.log(_dirname);

// ARGS: URL AccessKey SecretKey BucketName

function validateArgs(input) {
  if (!input) throw new Error("Please Check your args");
  return input;
}
const SIMIN_URL = validateArgs(process.argv[2]);
const ACCESS_KEY = validateArgs(process.argv[3]);
const SECRET_KEY = validateArgs(process.argv[4]);

const BUCKET_NAME = validateArgs(process.argv[5]);

const client = new S3Client({
  endpoint: SIMIN_URL,
  region: "default",
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
  },
});

const rootName = ".";

const fileList = fs.globSync(join(_dirname, "dist", "**", "*"));

for (const filePath of fileList) {
  const [_, fileName] = filePath.split("dist");
  const res = fs.statSync(filePath);
  if (res.isFile() === false) continue;
  const fileBuffer = fs.readFileSync(filePath);
  const ContentType = mime.getType(extname(fileName));
  const Key = join(rootName, fileName);
  await client.send(
    new PutObjectCommand({
      ACL: "public-read",
      Key,
      Bucket: BUCKET_NAME,
      ContentType,
      Body: fileBuffer,
    })
  );

  console.log({
    Key,
    ContentType,
    message: "successful",
  });
}
