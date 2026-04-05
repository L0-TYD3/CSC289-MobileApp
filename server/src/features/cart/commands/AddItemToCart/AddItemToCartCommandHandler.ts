import { PrismaService } from '@/services/Prisma.service';
import { UpdatedMessageResponse } from '@/types/MessageReponse.type';
import { Shopping_Cart, Shopping_Cart_Item } from '@generated/prisma/client';
import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AddItemToCartCommand } from './AddItemToCartCommand';

/**
 * Handles `AddItemToCartCommand` — adds a product to the customer's cart or
 * increments its quantity if it is already present.
 *
 * Steps:
 * 1. Find the first `Inventory` record for the given `productId`.
 * 2. Reject with 400 if the product is out of stock (`Quantity <= 0`).
 * 3. Upsert the `Shopping_Cart_Item` by composite key (`Cart_ID + Inventory_ID`):
 *    - **Exists** → increment `Quantity` by the requested amount.
 *    - **New** → create a new cart item with the requested quantity.
 */
@CommandHandler(AddItemToCartCommand)
export class AddItemToCartCommandHandler implements ICommandHandler<AddItemToCartCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    command: AddItemToCartCommand,
  ): Promise<UpdatedMessageResponse> {
    let cart: Shopping_Cart | null = null;

    // Get cart or create a new one - For simplicity sake, we are just going to get the latest cart for the customer. Down the road, you could add in a cart id
    cart = await this.prisma.shopping_Cart.findFirst({
      where: {
        Customer_ID: command.userId,
      },
      orderBy: {
        Created_At: 'desc',
      },
      include: {
        items: {
          include: {
            inventory: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await this.prisma.shopping_Cart.create({
        data: {
          Customer_ID: command.userId,
        },
      });
    }

    // Make sure that the inventory qty of the prod they want to add is greater than 0
    const inventory = await this.prisma.inventory.findFirst({
      where: {
        Product_ID: command.dto.productId,
      },
      include: {
        product: true,
      },
    });

    if (!inventory || inventory.Quantity <= 0)
      throw new BadRequestException('Product is out of stock');

    let cartItem: Shopping_Cart_Item | null = null;

    cartItem = await this.prisma.shopping_Cart_Item.findFirst({
      where: {
        Cart_ID: cart.Cart_ID,
        Inventory_ID: inventory.Inventory_ID,
      },
    });

    // Check to see if there is enough inventory to complete the request
    const alreadyInCart = cartItem?.Quantity ?? 0;
    if (inventory.Quantity - alreadyInCart - command.dto.quantity < 0)
      throw new BadRequestException(
        `There is not enough inventory to complete this request. Current Inventory: ${inventory.Quantity} - Requested Amount: ${command.dto.quantity + alreadyInCart} `,
      );

    // If there is not a cart item, create a new one, otherwise just update the quantity
    if (!cartItem) {
      cartItem = await this.prisma.shopping_Cart_Item.create({
        data: {
          Cart_ID: cart.Cart_ID,
          Inventory_ID: inventory.Inventory_ID,
          Quantity: command.dto.quantity,
          Created_At: new Date(),
          Updated_At: new Date(),
        },
      });
    } else {
      await this.prisma.shopping_Cart_Item.update({
        where: {
          Cart_ID_Inventory_ID: {
            Cart_ID: cart.Cart_ID,
            Inventory_ID: inventory.Inventory_ID,
          },
        },
        data: {
          Updated_At: new Date(),
          Quantity: {
            increment: command.dto.quantity,
          },
        },
      });
    }

    return new UpdatedMessageResponse(
      'Cart updated successfully',
      cart.Cart_ID,
    );
  }
}
