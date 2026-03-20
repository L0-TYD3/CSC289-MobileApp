import { Module } from '@nestjs/common';
import { CustomerController } from './Customer.controller';
import { GetCurrentCustomerDetailsQueryHandler } from './queries/GetCurrentCustomerDetails/GetCurrentCustomerDetailsQueryHandler';
import { GetCustomerByEmailQueryHandler } from './queries/GetCustomerByEmail/GetCustomerByEmailQueryHandler';

@Module({
  providers: [
    GetCustomerByEmailQueryHandler,
    GetCurrentCustomerDetailsQueryHandler,
  ],
  controllers: [CustomerController],
})
export class CustomerModule {}
