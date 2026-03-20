import { Query } from '@nestjs/cqrs';
import { OrderListResponseDto } from '../../dtos/OrderListResponse.dto';

export class GetCurrentUsersOrdersQuery extends Query<OrderListResponseDto[]> {
  constructor(public readonly customerId: number) {
    super();
  }
}
