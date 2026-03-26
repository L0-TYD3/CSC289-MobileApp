import { DeletedMessageResponse } from '@/types/MessageReponse.type';
import { Command } from '@nestjs/cqrs';

export class DeleteAddressCommand extends Command<DeletedMessageResponse> {
  constructor(public readonly addressId: number) {
    super();
  }
}
