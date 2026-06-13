import 'dotenv/config';
import type { PrismaConfig } from 'prisma';
import { env } from 'prisma/config';

const rootPathSchema = 'prisma';
export default {
  schema: `${rootPathSchema}/`,
  migrations: {
    path: `${rootPathSchema}/migrations`,
    seed: `tsx ${rootPathSchema}/seed.ts`,
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
} satisfies PrismaConfig;
