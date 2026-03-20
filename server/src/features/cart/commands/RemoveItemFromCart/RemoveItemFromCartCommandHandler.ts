import { PrismaService } from '@/services/Prisma.service';
import { DeletedMessageResponse } from '@/types/MessageReponse.type';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveItemFromCartCommand } from './RemoveItemFromCartCommand';

@CommandHandler(RemoveItemFromCartCommand)
export class RemoveItemFromCartCommandHandler implements ICommandHandler<RemoveItemFromCartCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    command: RemoveItemFromCartCommand,
  ): Promise<DeletedMessageResponse> {
    await this.prisma.shopping_Cart_Item.delete({
      where: {
        Cart_ID_Inventory_ID: {
          Cart_ID: command.cart.Cart_ID,
          Inventory_ID: command.inventoryId,
        },
      },
    });

    return new DeletedMessageResponse('Item removed from cart successfully');
  }
}
