import type { Config } from 'drizzle-kit';
import { config } from 'dotenv';

config();

export default {
  schema: './src/database/schema/index.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
} satisfies Config;
