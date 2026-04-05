import { UpdatedMessageResponse } from '@/types/MessageReponse.type';
import { Command } from '@nestjs/cqrs';
import { AddItemToCartRequestDto } from '../../dtos/AddItemToCartRequest.dto';

export class AddItemToCartCommand extends Command<UpdatedMessageResponse> {
  constructor(
    public readonly userId: number,
    public readonly dto: AddItemToCartRequestDto,
  ) {
    super();
  }
}
