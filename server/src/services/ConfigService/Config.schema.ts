import z from 'zod';

export const configSchema = z.object({
  // GENERAL
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.coerce.number(),
  API_URL: z.string().optional().default('http://localhost:3000'),
  JWT_SECRET: z.string(),

  // DATABASE
  DATABASE_URL: z.string(),
  DB_HOST: z.string(),
  DB_PORT: z.coerce.number(),
  DB_NAME: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_TIMEOUT: z.coerce.number(),
  DB_POOL_MIN_CONNECTIONS: z.coerce.number(),
  DB_POOL_MAX_CONNECTIONS: z.coerce.number(),
  DB_TRUST_SERVER_CERTIFICATE: z.string().transform((val) => val === 'true'),
  DB_ENCRYPT: z.string().transform((val) => val === 'true'),
  DB_TRUST_CONNECTION: z.string().transform((val) => val === 'true'),
});

export type AppConfig = z.infer<typeof configSchema>;
