import { PrismaService } from '@/services/Prisma.service';
import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CustomerDetailsResponseDto } from '../../models/CustomerDetailsResponse.dto';
import { MembershipLevel } from '../../models/MembershipLevel.enum';
import { GetCurrentCustomerDetailsQuery } from './GetCurrentCustomerDetailsQuery';

@QueryHandler(GetCurrentCustomerDetailsQuery)
export class GetCurrentCustomerDetailsQueryHandler implements IQueryHandler<GetCurrentCustomerDetailsQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    query: GetCurrentCustomerDetailsQuery,
  ): Promise<CustomerDetailsResponseDto> {
    const customer = await this.prisma.customer.findUnique({
      where: { Customer_ID: query.customerId },
      include: { member: true },
    });
    if (!customer)
      throw new NotFoundException(
        `Customer with id ${query.customerId} not found`,
      );

    return {
      id: customer.Customer_ID,
      email: customer.Email,
      firstName: customer.First_Name,
      lastName: customer.Last_Name,
      fullName: `${customer.First_Name} ${customer.Last_Name}`,
      phone: customer.Phone,
      memberDetails: {
        memberShipLevel: customer.member.Membership_Level as MembershipLevel,
        discountRate: customer.member.Discount_Rate.toNumber(),
      },
    };
  }
}
