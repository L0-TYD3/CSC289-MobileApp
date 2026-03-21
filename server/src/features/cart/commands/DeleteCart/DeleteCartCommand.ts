import { DeletedMessageResponse } from '@/types/MessageReponse.type';
import { Shopping_Cart } from '@generated/prisma/client';
import { Command } from '@nestjs/cqrs';

export class DeleteCartCommand extends Command<DeletedMessageResponse> {
  constructor(public readonly cart: Shopping_Cart) {
    super();
  }
}
