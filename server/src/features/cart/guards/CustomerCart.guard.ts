import { PrismaService } from '@/services/Prisma.service';
import { getRequest } from '@/utils/getRequest';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class CustomerCartGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = getRequest(context);
    const cartId = request.params.cartId;
    const user = request.user;

    const cart = await this.prisma.shopping_Cart.findUnique({
      where: {
        Cart_ID: Number(cartId),
      },
    });
    if (!cart) throw new NotFoundException('Cart not found');
    if (cart.Customer_ID !== user?.id)
      throw new ForbiddenException(
        'You are not authorized to access this cart',
      );

    request.cart = cart;
    return true;
  }
}
