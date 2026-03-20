import { PrismaService } from '@/services/Prisma.service';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProductListItemDto } from '../../dtos/ProductListItem.dto';
import { GetProductsQuery } from './GetProductsQuery';

@QueryHandler(GetProductsQuery)
export class GetProductsQueryHandler implements IQueryHandler<GetProductsQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<ProductListItemDto[]> {
    const products = await this.prisma.product.findMany({
      include: {
        category: true,
        inventory: true,
        discounts: true,
        supplier: true,
      },
    });

    return products.map((product) => {
      const firstProduct = product.inventory?.[0];
      return {
        productId: product.Product_ID,
        productName: product.Product_Name,
        imageUrl: product.Image_URL,
        category: {
          categoryId: product.category.Category_ID,
          categoryName: product.category.Category_Name,
        },
        unitPrice: Number(firstProduct?.Unit_Price ?? 0),
        inStock: product.inventory?.some((i) => i.Quantity > 0) ?? false,
      };
    });
  }
}
