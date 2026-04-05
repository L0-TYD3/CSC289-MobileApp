import { Module } from '@nestjs/common';
import { CartController } from './Cart.controller';
import { AddItemToCartCommandHandler } from './commands/AddItemToCart/AddItemToCartCommandHandler';
import { DeleteCartCommandHandler } from './commands/DeleteCart/DeleteCartCommandHandler';
import { RemoveItemFromCartCommandHandler } from './commands/RemoveItemFromCart/RemoveItemFromCartCommandHandler';
import { UpdateItemQuantityCommandHandler } from './commands/UpdateItemQuantity/UpdateItemQuantityCommandHandler';
import { GetCartQtyQueryHandler } from './queries/GetCartQty/GetCartQtyQueryHandler';
import { GetCurrentCustomerCartQueryHandler } from './queries/GetCurrentCustomerCart/GetCurrentCustomerCartQueryHandler';

@Module({
  providers: [
    GetCurrentCustomerCartQueryHandler,
    GetCartQtyQueryHandler,
    AddItemToCartCommandHandler,
    UpdateItemQuantityCommandHandler,
    RemoveItemFromCartCommandHandler,
    DeleteCartCommandHandler,
  ],
  controllers: [CartController],
})
export class CartModule {}
