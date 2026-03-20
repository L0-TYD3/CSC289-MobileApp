import { Customer } from '@generated/prisma/client';
import { Query } from '@nestjs/cqrs';

export class GetCustomerByEmailQuery extends Query<Customer | null> {
  constructor(public readonly email: string) {
    super();
  }
}
