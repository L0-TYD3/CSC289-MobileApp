import { Query } from '@nestjs/cqrs';
import { ApiProperty } from '@nestjs/swagger';

export class GetCartQtyResponseDto {
  @ApiProperty({ type: Number, readOnly: true })
  cartId: number;
  @ApiProperty({ type: Number, readOnly: true })
  qty: number;
}

export class GetCartQtyQuery extends Query<GetCartQtyResponseDto | null> {
  constructor(public readonly customerId: number) {
    super();
  }
}
