import { Query } from '@nestjs/cqrs';
import { CustomerDetailsResponseDto } from '../../models/CustomerDetailsResponse.dto';

export class GetCurrentCustomerDetailsQuery extends Query<CustomerDetailsResponseDto> {
  constructor(public readonly customerId: number) {
    super();
  }
}
