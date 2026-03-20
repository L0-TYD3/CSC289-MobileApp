import { ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const getRequest = (context: ExecutionContext): Request => {
  return context.switchToHttp().getRequest();
};
