import { DeletedMessageResponse } from '@/types/MessageReponse.type';
import { Shopping_Cart } from '@generated/prisma/client';
import { Command } from '@nestjs/cqrs';

export class RemoveItemFromCartCommand extends Command<DeletedMessageResponse> {
  constructor(
    public readonly cart: Shopping_Cart,
    public readonly inventoryId: number,
  ) {
    super();
  }
}
