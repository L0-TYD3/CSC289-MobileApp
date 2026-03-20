import { AuthUserDto } from '@/features/auth/types/AuthUserDto.type';
import { getRequest } from '@/utils/getRequest';
import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export const User = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): AuthUserDto => {
    const request = getRequest(ctx);
    const user = request.user;
    if (!user) throw new UnauthorizedException('Unauthorized');
    return user;
  },
);
