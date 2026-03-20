import { Command } from '@nestjs/cqrs';
import { ProductDetailDto } from '../../dtos/ProductDetail.dto';

export class GetProductDetailsQuery extends Command<ProductDetailDto> {
  constructor(public readonly productId: number) {
    super();
  }
}
