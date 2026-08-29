import {
  CreateBucketCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { readFile } from 'node:fs/promises';

const required = (name) => {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is required`);
  return value;
};

const bucket = required('S3_BUCKET');
const client = new S3Client({
  endpoint: required('S3_ENDPOINT'),
  region: required('S3_REGION'),
  forcePathStyle: true,
  credentials: {
    accessKeyId: required('S3_ACCESS_KEY'),
    secretAccessKey: required('S3_SECRET_KEY'),
  },
});

try {
  await client.send(new HeadBucketCommand({ Bucket: bucket }));
} catch {
  await client.send(new CreateBucketCommand({ Bucket: bucket }));
}

const body = await readFile(
  process.env.RESUME_FILE?.trim() || '/app/deployment/sergey-kutushev-resume.pdf',
);
await client.send(
  new PutObjectCommand({
    Bucket: bucket,
    Key: 'public/sergey-kutushev-resume.pdf',
    Body: body,
    ContentType: 'application/pdf',
    ContentDisposition: 'attachment; filename="sergey-kutushev-resume.pdf"',
    CacheControl: 'public, max-age=3600',
  }),
);
console.log(`Synchronized resume asset (${body.byteLength} bytes)`);
