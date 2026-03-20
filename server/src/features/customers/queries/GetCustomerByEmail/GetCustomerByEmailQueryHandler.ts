import { PrismaService } from '@/services/Prisma.service';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCustomerByEmailQuery } from './GetCustomerByEmailQuery';

@QueryHandler(GetCustomerByEmailQuery)
export class GetCustomerByEmailQueryHandler implements IQueryHandler<GetCustomerByEmailQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetCustomerByEmailQuery): Promise<any> {
    return this.prisma.customer.findUnique({
      where: {
        Email: query.email,
      },
    });
  }
}
