import { Module } from '@nestjs/common';
import { GetCustomerByEmailQueryHandler } from './queries/GetCustomerByEmail/GetCustomerByEmailQueryHandler';

@Module({
  providers: [GetCustomerByEmailQueryHandler],
  controllers: [],
})
export class CustomerModule {}
