import { Query } from '@nestjs/cqrs';
import { OrderDetailsResponseDto } from '../../dtos/OrderDetailsReponse.dto';

export class GetCurrentUserOrderDetailsQuery extends Query<OrderDetailsResponseDto> {
  constructor(
    public readonly orderId: number,
    public readonly customerId: number,
  ) {
    super();
  }
}
