import { PrismaService } from '@/services/Prisma.service';
import { UpdatedMessageResponse } from '@/types/MessageReponse.type';
import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateItemQuantityCommand } from './UpdateItemQuantityCommand';

@CommandHandler(UpdateItemQuantityCommand)
export class UpdateItemQuantityCommandHandler implements ICommandHandler<UpdateItemQuantityCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    command: UpdateItemQuantityCommand,
  ): Promise<UpdatedMessageResponse> {
    const cartItem = await this.prisma.shopping_Cart_Item.findUnique({
      where: {
        Cart_ID_Inventory_ID: {
          Cart_ID: command.cart.Cart_ID,
          Inventory_ID: command.dto.inventoryId,
        },
      },
    });

    if (!cartItem) throw new NotFoundException('Cart item not found');

    await this.prisma.shopping_Cart_Item.update({
      where: {
        Cart_ID_Inventory_ID: {
          Cart_ID: command.cart.Cart_ID,
          Inventory_ID: command.dto.inventoryId,
        },
      },
      data: {
        Quantity: command.dto.quantity,
      },
    });

    return new UpdatedMessageResponse(
      'Cart item quantity updated successfully',
      cartItem.Cart_ID,
    );
  }
}
