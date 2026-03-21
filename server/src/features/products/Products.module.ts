import { Module } from '@nestjs/common';
import { ProductsController } from './Products.controller';
import { GetProductDetailsQueryHandler } from './queries/GetProductDetails/GetProductDetailsQueryHandler';
import { GetProductsQueryHandler } from './queries/GetProducts/GetProductsQueryHandler';

@Module({
  providers: [GetProductsQueryHandler, GetProductDetailsQueryHandler],
  controllers: [ProductsController],
})
export class ProductsModule {}
