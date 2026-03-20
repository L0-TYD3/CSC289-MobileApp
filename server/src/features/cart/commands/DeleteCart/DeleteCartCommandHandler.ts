import { PrismaService } from '@/services/Prisma.service';
import { DeletedMessageResponse } from '@/types/MessageReponse.type';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteCartCommand } from './DeleteCartCommand';

@CommandHandler(DeleteCartCommand)
export class DeleteCartCommandHandler implements ICommandHandler<DeleteCartCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: DeleteCartCommand): Promise<DeletedMessageResponse> {
    await this.prisma.shopping_Cart.delete({
      where: {
        Cart_ID: command.cart.Cart_ID,
      },
    });

    return new DeletedMessageResponse(
      'Cart deleted successfully',
      command.cart.Cart_ID,
    );
  }
}
