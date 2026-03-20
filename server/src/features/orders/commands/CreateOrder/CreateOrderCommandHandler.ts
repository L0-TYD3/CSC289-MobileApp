import { TAX_RATE } from '@/constants';
import { PrismaService, TX } from '@/services/Prisma.service';
import { CreatedMessageResponse } from '@/types/MessageReponse.type';
import { Order_Item, Prisma } from '@generated/prisma/client';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PaymentMethod } from '../../dtos/PaymentMethod.dto';
import { PaymentStatus } from '../../dtos/PaytmentStatus.enum';
import { CreateOrderCommand } from './CreateOrderCommand';

@CommandHandler(CreateOrderCommand)
export class CreateOrderCommandHandler implements ICommandHandler<CreateOrderCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: CreateOrderCommand): Promise<CreatedMessageResponse> {
    const cart = await this.prisma.shopping_Cart.findUnique({
      where: {
        Cart_ID: command.dto.cartId,
      },
      include: {
        items: {
          include: {
            inventory: true,
          },
        },
      },
    });

    if (!cart)
      throw new NotFoundException(
        `Cart with id ${command.dto.cartId} not found`,
      );
    if (cart.Customer_ID !== command.customerId)
      throw new ForbiddenException(
        'You are not authorized to create an order for this cart',
      );

    const orderData: Prisma.OrderCreateInput = {
      customer: {
        connect: {
          Customer_ID: command.customerId,
        },
      },
      items: {
        createMany: {
          data: cart.items.map((i) => ({
            Inventory_ID: i.Inventory_ID,
            Quantity: i.Quantity,
            Amount: i.inventory.Unit_Price,
            Tax: i.inventory.Unit_Price?.toNumber() ?? 0 * TAX_RATE,
            Created_At: new Date(),
            Updated_At: new Date(),
          })),
        },
      },
    };

    const transaction = await this.prisma.$transaction(async (tx) => {
      // Create the order
      const createdOrder = await tx.order.create({
        data: orderData,
        include: {
          items: true,
        },
      });

      // Create the payment - in a real app we would use a payment gateway and get a response but we are mocking it in this project.
      await this.createPayment(
        tx,
        createdOrder.Order_ID,
        command.dto.paymentMethod,
      );

      // Clear the shopping cart
      await this.clearCart(tx, command.dto.cartId);
      // Update the inventory quantites
      await this.updateInventory(tx, createdOrder.items);

      return createdOrder;
    });

    return new CreatedMessageResponse(
      'Order created successfully',
      transaction.Order_ID,
    );
  }

  private async createPayment(
    tx: TX,
    orderId: number,
    paymentMethod: PaymentMethod,
  ) {
    await tx.payment.create({
      data: {
        Order_ID: orderId,
        Payment_Status: PaymentStatus.COMPLETED, // Since this is a mock payment, we are just assuming it was completed.
        Method: paymentMethod,
        Created_At: new Date(),
        Updated_At: new Date(),
      },
    });
  }

  private async clearCart(tx: TX, cartId: number): Promise<void> {
    await tx.shopping_Cart.delete({
      where: {
        Cart_ID: cartId,
      },
    });
  }

  private async updateInventory(tx: TX, items: Order_Item[]): Promise<void> {
    for (const item of items) {
      await tx.inventory.update({
        where: {
          Inventory_ID: item.Inventory_ID,
        },
        data: {
          Quantity: {
            decrement: item.Quantity,
          },
        },
      });
    }
  }
}
