import { AuthUserDto } from '@/features/auth/types/AuthUserDto.type';
import { Shopping_Cart } from '@generated/prisma';
import 'express';

declare module 'express' {
  interface Request {
    user: AuthUserDto | null;
    cart: Shopping_Cart | null;
  }
}
