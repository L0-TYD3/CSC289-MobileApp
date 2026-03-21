import { Query } from '@nestjs/cqrs';
import { ProductListItemDto } from '../../dtos/ProductListItem.dto';

export class GetProductsQuery extends Query<ProductListItemDto[]> {}
