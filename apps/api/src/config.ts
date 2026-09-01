import { z } from 'zod';

const schema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().positive().default(4000),
    RATE_LIMIT_PER_MINUTE: z.coerce.number().int().positive().default(60),
    DB_SLOW_QUERY_MS: z.coerce.number().int().nonnegative().default(250),
    DATABASE_URL: z.string().min(1),
    REDIS_URL: z.string().url(),
    // Object storage is written by the asset path alone. Requiring credentials
    // to boot meant a deployment that never touches an object could not start
    // without an account it never uses; `superRefine` below demands them from
    // the flag that actually reaches storage.
    S3_ENDPOINT: z.string().url().optional(),
    S3_REGION: z.string().default('us-east-1'),
    S3_BUCKET: z.string().min(1).optional(),
    S3_ACCESS_KEY: z.string().min(1).optional(),
    S3_SECRET_KEY: z.string().min(1).optional(),
    ASSET_MAX_BYTES: z.coerce.number().int().positive().default(10_485_760),
    WEB_ORIGIN: z.string().url(),
    GITHUB_OWNER: z.string().min(1).default('Sskutushev'),
    GITHUB_TOKEN: z.string().min(20).optional(),
    ENABLE_WORKERS: z
      .enum(['true', 'false'])
      .default('false')
      .transform((value) => value === 'true'),
    ENABLE_MUTATIONS: z
      .enum(['true', 'false'])
      .default('false')
      .transform((value) => value === 'true'),
    // Split from `ENABLE_MUTATIONS` because that flag was answering two
    // independent questions at once: may this deployment be written to, and
    // does it have an object store. They came apart the moment a deployment
    // had to accept its own measured quality from CI while having no S3
    // account at all — see `docs/operations/deployment.md`.
    ENABLE_ASSET_MUTATIONS: z
      .enum(['true', 'false'])
      .default('false')
      .transform((value) => value === 'true'),
    MANAGEMENT_TOKEN: z.string().min(32).optional(),
    GEMINI_API_KEY: z.string().min(20).optional(),
    GEMINI_MODEL: z.string().min(1).default('gemini-2.5-flash'),
    SEMANTIC_URL: z.string().url().optional(),
  })
  .superRefine((value, context) => {
    if (value.ENABLE_MUTATIONS && !value.MANAGEMENT_TOKEN) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['MANAGEMENT_TOKEN'],
        message: 'MANAGEMENT_TOKEN is required when mutations are enabled',
      });
    }
    if (value.ENABLE_ASSET_MUTATIONS && !value.ENABLE_MUTATIONS) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['ENABLE_MUTATIONS'],
        message: 'ENABLE_MUTATIONS is required when asset mutations are enabled',
      });
    }
    if (!value.ENABLE_ASSET_MUTATIONS) return;
    for (const key of ['S3_ENDPOINT', 'S3_BUCKET', 'S3_ACCESS_KEY', 'S3_SECRET_KEY'] as const) {
      if (value[key]) continue;
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: [key],
        message: `${key} is required when asset mutations are enabled`,
      });
    }
  });

export type AppConfig = z.infer<typeof schema>;
export const validateConfig = (value: Record<string, unknown>): AppConfig => schema.parse(value);
