import { User } from '@/decorators/User.decorator';
import { CreatedMessageResponse } from '@/types/MessageReponse.type';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthUserDto } from '../auth/types/AuthUserDto.type';
import { CreateOrderCommand } from './commands/CreateOrder/CreateOrderCommand';
import { CreateOrderCommandDto } from './dtos/CreateOrderCommand.dto';
import { OrderDetailsResponseDto } from './dtos/OrderDetailsReponse.dto';
import { OrderListResponseDto } from './dtos/OrderListResponse.dto';
import { GetCurrentUserOrderDetailsQuery } from './queries/GetCurrentUsersOrderDetails/GetCurrentUserOrderDetailsQuery';
import { GetCurrentUsersOrdersQuery } from './queries/GetCurrentUsersOrders/GetCurrentUsersOrdersQuery';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  // Get current users order GET /orders
  @Get()
  @ApiOperation({ summary: 'Get current users orders' })
  @ApiOkResponse({ type: [OrderListResponseDto] })
  async getOrders(@User() user: AuthUserDto) {
    return this.queryBus.execute(new GetCurrentUsersOrdersQuery(user.id));
  }

  // Get current users order details by id GET /orders/:orderId
  @Get(':orderId')
  @ApiOperation({ summary: 'Get current users orders' })
  @ApiParam({ type: Number, required: true, name: 'orderId' })
  @ApiOkResponse({ type: OrderDetailsResponseDto })
  async getOrderDetails(
    @Param('orderId', ParseIntPipe) orderId: number,
    @User() user: AuthUserDto,
  ) {
    return this.queryBus.execute(
      new GetCurrentUserOrderDetailsQuery(orderId, user.id),
    );
  }

  // Create a new order POST /orders
  @Post()
  @ApiOperation({ description: 'Create a user order' })
  @ApiBody({ type: CreateOrderCommandDto, required: true })
  @ApiOkResponse({ type: CreatedMessageResponse })
  async createOrder(
    @Body() body: CreateOrderCommandDto,
    @User() user: AuthUserDto,
  ) {
    return this.commandBus.execute(new CreateOrderCommand(body, user.id));
  }
}
