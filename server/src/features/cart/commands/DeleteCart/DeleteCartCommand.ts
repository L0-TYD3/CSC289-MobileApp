import { DeletedMessageResponse } from '@/types/MessageReponse.type';
import { Command } from '@nestjs/cqrs';

export class DeleteCartCommand extends Command<DeletedMessageResponse> {
  constructor(
    public readonly cartId: number,
    public readonly userId: number,
  ) {
    super();
  }
}
