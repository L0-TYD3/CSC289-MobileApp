import { AuthUserDto } from '@/features/auth/types/AuthUserDto.type';
import 'express';

declare module 'express' {
  interface Request {
    user: AuthUserDto | null;
  }
}
