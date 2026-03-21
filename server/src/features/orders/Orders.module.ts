import { Module } from '@nestjs/common';
import { CreateOrderCommandHandler } from './commands/CreateOrder/CreateOrderCommandHandler';
import { OrdersController } from './Orders.controller';
import { GetCurrentUserOrderDetailsQueryHandler } from './queries/GetCurrentUsersOrderDetails/GetCurrentUserOrderDetailsQueryHandler';
import { GetCurrentUsersOrdersQueryHandler } from './queries/GetCurrentUsersOrders/GetCurrentUsersOrdersQueryHandler';

@Module({
  providers: [
    GetCurrentUsersOrdersQueryHandler,
    CreateOrderCommandHandler,
    GetCurrentUserOrderDetailsQueryHandler,
  ],
  controllers: [OrdersController],
})
export class OrdersModule {}
