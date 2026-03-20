import {
  CorsOptions,
  CorsOptionsDelegate,
} from '@nestjs/common/interfaces/external/cors-options.interface';

export const useCorsOptions = (): CorsOptions | CorsOptionsDelegate<any> => {
  return {
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      ...(process.env.CORS_ORIGIN ? JSON.parse(process.env.CORS_ORIGIN) : []),
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Forwarded-Proto',
      'X-Forwarded-Host',
      'X-Forwarded-For',
      'X-API-KEY',
      ...(process.env.CORS_ALLOWED_HEADERS
        ? JSON.parse(process.env.CORS_ALLOWED_HEADERS)
        : []),
    ],
    exposedHeaders: [
      'Content-Range',
      'X-Total-Count',
      ...(process.env.CORS_EXPOSED_HEADERS
        ? JSON.parse(process.env.CORS_EXPOSED_HEADERS)
        : []),
    ],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    maxAge: 600,
  };
};
