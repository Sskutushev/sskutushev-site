import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().url(),
  S3_ENDPOINT: z.string().url(),
  S3_REGION: z.string().default('us-east-1'),
  S3_BUCKET: z.string().min(1),
  S3_ACCESS_KEY: z.string().min(1),
  S3_SECRET_KEY: z.string().min(1),
  WEB_ORIGIN: z.string().url(),
  GITHUB_OWNER: z.string().min(1).default('Sskutushev'),
  ENABLE_MUTATIONS: z.enum(['true', 'false']).default('false'),
  GEMINI_API_KEY: z.string().min(20).optional(),
  GEMINI_MODEL: z.string().min(1).default('gemini-2.5-flash'),
});

export type AppConfig = z.infer<typeof schema>;
export const validateConfig = (value: Record<string, unknown>): AppConfig => schema.parse(value);
