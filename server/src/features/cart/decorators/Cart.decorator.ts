import { getRequest } from '@/utils/getRequest';
import { Shopping_Cart } from '@generated/prisma/client';
import {
  createParamDecorator,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';

export const Cart = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): Shopping_Cart => {
    const request = getRequest(ctx);
    if (!request.cart) throw new NotFoundException('Cart not found');
    return request.cart;
  },
);
