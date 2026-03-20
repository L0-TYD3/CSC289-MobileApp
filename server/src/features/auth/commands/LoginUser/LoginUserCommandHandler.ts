import { GetCustomerByEmailQuery } from '@/features/customers/queries/GetCustomerByEmail/GetCustomerByEmailQuery';
import { Customer } from '@generated/prisma/client';
import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { LoginUserCommand } from './LoginUserCommand';

@CommandHandler(LoginUserCommand)
export class LoginUserCommandHandler implements ICommandHandler<LoginUserCommand> {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly jwtService: JwtService,
  ) {}

  async execute(command: LoginUserCommand): Promise<string> {
    const { email } = command.dto;
    const customer = await this.queryBus.execute(
      new GetCustomerByEmailQuery(email),
    );
    if (!customer) throw new NotFoundException('Customer not found');

    return await this.generateToken(customer);
  }

  private async generateToken(customer: Customer) {
    const payload = {
      sub: customer.Customer_ID,
      email: customer.Email,
      name: `${customer.First_Name} ${customer.Last_Name}`,
    };

    return this.jwtService.signAsync(payload);
  }
}
