import { CreatedMessageResponse } from '@/types/MessageReponse.type';
import { Command } from '@nestjs/cqrs';
import { CreateOrderCommandDto } from '../../dtos/CreateOrderCommand.dto';

// TODO: send a better response
export class CreateOrderCommand extends Command<CreatedMessageResponse> {
  constructor(
    public readonly dto: CreateOrderCommandDto,
    public readonly customerId: number,
  ) {
    super();
  }
}
