import { PrismaService } from '@/services/Prisma.service';
import { UpdatedMessageResponse } from '@/types/MessageReponse.type';
import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AddItemToCartCommand } from './AddItemToCartCommand';

@CommandHandler(AddItemToCartCommand)
export class AddItemToCartCommandHandler implements ICommandHandler<AddItemToCartCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    command: AddItemToCartCommand,
  ): Promise<UpdatedMessageResponse> {
    const inventory = await this.prisma.inventory.findFirst({
      where: {
        Product_ID: command.dto.productId,
      },
    });

    if (!inventory || inventory.Quantity <= 0)
      throw new BadRequestException('Product is out of stock');

    const cartItem = await this.prisma.shopping_Cart_Item.upsert({
      where: {
        Cart_ID_Inventory_ID: {
          Cart_ID: command.cart.Cart_ID,
          Inventory_ID: inventory.Inventory_ID,
        },
      },
      update: {
        Quantity: {
          increment: command.dto.quantity,
        },
      },
      create: {
        Cart_ID: command.cart.Cart_ID,
        Inventory_ID: inventory.Inventory_ID,
        Quantity: command.dto.quantity,
      },
    });

    return new UpdatedMessageResponse(
      'Item added to cart successfully',
      cartItem.Cart_ID,
    );
  }
}
