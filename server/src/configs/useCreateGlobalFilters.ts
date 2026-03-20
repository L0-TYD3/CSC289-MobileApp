import {
  PrismaKnownExceptionFilter,
  PrismaKnownRequestExceptionFilter,
  PrismaUnknownRequestExceptionFilter,
} from '@/filters/PrismaKnownExceptions.filter';
import { INestApplication } from '@nestjs/common';

export const useGlobalFilters = (app: INestApplication) => {
  app.useGlobalFilters(new PrismaKnownExceptionFilter());
  app.useGlobalFilters(new PrismaKnownRequestExceptionFilter());
  app.useGlobalFilters(new PrismaUnknownRequestExceptionFilter());
};
