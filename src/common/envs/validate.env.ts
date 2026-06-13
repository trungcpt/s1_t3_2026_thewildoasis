import { Logger } from '@nestjs/common';
import { isEmpty } from 'es-toolkit/compat';
import { z, ZodType } from 'zod';

const zodWarnOptional = <T extends ZodType>(schema: T, envName: string) =>
  schema.optional().transform((val) => {
    if (isEmpty(val)) {
      Logger.warn(`ENV [${envName}] is not set. Some features may not work.`);
      return undefined;
    }
    return val;
  });

const baseEnvSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default('localhost'),
  APP_PREFIX: z.string().default('/api'),
  APP_NAME: z.string().default('nestjs_ecommerce'),
  APP_URL: z.url().optional(),

  FE_URL: z.string().default('["*"]'),

  THROTTLE_TTL: z.coerce.number().default(600000),
  THROTTLE_LIMIT: z.coerce.number().default(100),

  JWT_SECRET: z.string().default('nestjs_ecommerce_JWT'),

  MULTER_DESTINATION_FILE: z.string().default('./uploads'),

  CLOUDINARY_NAME: zodWarnOptional(z.string(), 'CLOUDINARY_NAME'),
  CLOUDINARY_API_KEY: zodWarnOptional(z.string(), 'CLOUDINARY_API_KEY'),
  CLOUDINARY_API_SECRET: zodWarnOptional(z.string(), 'CLOUDINARY_API_SECRET'),

  MAIL_INCOMING_USER: zodWarnOptional(z.string(), 'MAIL_INCOMING_USER'),
  MAIL_INCOMING_PASS: zodWarnOptional(z.string(), 'MAIL_INCOMING_PASS'),
  MAIL_HOST: zodWarnOptional(z.string(), 'MAIL_HOST'),
  MAIL_PORT: zodWarnOptional(z.string(), 'MAIL_PORT'),

  VNPAY_TMN_CODE: zodWarnOptional(z.string(), 'VNPAY_TMN_CODE'),
  VNPAY_SECURE_SECRET: zodWarnOptional(z.string(), 'VNPAY_SECURE_SECRET'),
  VNPAY_HOST: zodWarnOptional(z.string(), 'VNPAY_HOST'),
  GEMINI_API_KEY: zodWarnOptional(z.string(), 'GEMINI_API_KEY'),

  CACHE_INTERNAL_TTL: z.coerce.number().default(30000),

  DATABASE_URL: z.string(),
});

const envSchema = baseEnvSchema.transform((data) => {
  const expectedUrl = `http://${data.HOST}:${data.PORT}${data.APP_PREFIX}`;

  if (!data.APP_URL) {
    data = { ...data, APP_URL: expectedUrl };
  }

  if (data.APP_URL !== expectedUrl) {
    throw new Error(`APP_URL must be "${expectedUrl}"`);
  }

  if (!data.JWT_SECRET) {
    data = { ...data, JWT_SECRET: `JWT_SECRET_${data.APP_NAME}` };
  }

  return data;
});

type EnvSchema = z.infer<typeof baseEnvSchema>;

export const EnvVars = Object.keys(baseEnvSchema.shape).reduce(
  (acc, key) => {
    acc[key] = key;
    return acc;
  },
  {} as Record<keyof EnvSchema, keyof EnvSchema>,
);

export const validate = (config: Record<string, unknown>) => {
  const parsed = envSchema.safeParse(config);
  if (!parsed.success) {
    const errors = parsed.error.issues.map(
      (err) => `[${String(err.path[0])}] ${err.message}`,
    );
    throw new Error(`Please check .env config: ${errors.join('\n')}`);
  }
  return parsed.data;
};
