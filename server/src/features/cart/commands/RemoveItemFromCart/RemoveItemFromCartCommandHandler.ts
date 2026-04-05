import { PrismaService } from '@/services/Prisma.service';
import { DeletedMessageResponse } from '@/types/MessageReponse.type';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveItemFromCartCommand } from './RemoveItemFromCartCommand';

/**
 * Handles `RemoveItemFromCartCommand` — permanently deletes a single item from
 * the customer's cart by its composite key (`Cart_ID + Inventory_ID`).
 *
 * The cart itself is NOT deleted; only the specific line item is removed.
 * To clear the entire cart use `DeleteCartCommand` instead.
 */
@CommandHandler(RemoveItemFromCartCommand)
export class RemoveItemFromCartCommandHandler implements ICommandHandler<RemoveItemFromCartCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    command: RemoveItemFromCartCommand,
  ): Promise<DeletedMessageResponse> {
    const cartItem = await this.prisma.shopping_Cart_Item.findUnique({
      where: {
        Cart_ID_Inventory_ID: {
          Cart_ID: command.cartId,
          Inventory_ID: command.dto.inventoryId,
        },
      },
      include: {
        cart: true,
      },
    });

    if (!cartItem) throw new NotFoundException('Cart item not found');
    if (cartItem.cart.Customer_ID !== command.userId)
      throw new ForbiddenException(
        'You are not authorized to remove an item from this cart.',
      );

    await this.prisma.shopping_Cart_Item.delete({
      where: {
        Cart_ID_Inventory_ID: {
          Cart_ID: command.cartId,
          Inventory_ID: command.dto.inventoryId,
        },
      },
    });

    return new DeletedMessageResponse('Item removed from cart successfully');
  }
}
