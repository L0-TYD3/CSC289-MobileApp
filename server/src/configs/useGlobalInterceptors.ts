import { BigIntInterceptor } from '@/interceptors/BigIntInterceptor';
import { INestApplication } from '@nestjs/common';

export const useGlobalInterceptors = (app: INestApplication) => {
  app.useGlobalInterceptors(new BigIntInterceptor());
};
