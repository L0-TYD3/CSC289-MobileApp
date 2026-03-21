import { ApiProperty } from '@nestjs/swagger';
import { ProductCategoryDto } from './ProductCategory.dto';

export class ProductListItemDto {
  @ApiProperty({ type: Number, required: true })
  productId: number;

  @ApiProperty({ type: String, required: true })
  productName: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  imageUrl: string | null;

  @ApiProperty({ type: ProductCategoryDto, required: true })
  category: ProductCategoryDto;

  @ApiProperty({ type: Number, required: true })
  unitPrice: number; // pulled from first inventory record

  @ApiProperty({ type: Boolean, required: true })
  inStock: boolean;
}
