import { PrismaService } from '@/services/Prisma.service';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { OrderListResponseDto } from '../../dtos/OrderListResponse.dto';
import { calculateOrderAmount } from '../../utils/CalculateOrderAmount';
import { GetCurrentUsersOrdersQuery } from './GetCurrentUsersOrdersQuery';

@QueryHandler(GetCurrentUsersOrdersQuery)
export class GetCurrentUsersOrdersQueryHandler implements IQueryHandler<GetCurrentUsersOrdersQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    query: GetCurrentUsersOrdersQuery,
  ): Promise<OrderListResponseDto[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        Customer_ID: query.customerId,
      },
      include: {
        customer: true,
        items: true,
      },
    });

    // calcualte the total of each order based on the item amount * quantity * tax rate
    const ordersWithTotal = orders.map((order) => {
      const total = calculateOrderAmount(order.items);
      return {
        ...order,
        totalAmount: total,
      };
    });

    return ordersWithTotal.map((order) => ({
      id: order.Order_ID,
      customer: {
        id: order.customer.Customer_ID,
        email: order.customer.Email,
        name: `${order.customer.First_Name} ${order.customer.Last_Name}`,
      },
      orderDate: order.Order_Date,
      totalAmount: order.totalAmount,
    }));
  }
}
