import { ExecutionContext } from '@nestjs/common';
import { Response } from 'express';

export const getResponse = (context: ExecutionContext): Response => {
  return context.switchToHttp().getResponse();
};
