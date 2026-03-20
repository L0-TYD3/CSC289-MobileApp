import { ApiProperty } from '@nestjs/swagger';

export class OrderCustomerDto {
  @ApiProperty({ type: Number, required: true })
  id: number;
  @ApiProperty({ type: String, required: true })
  email: string;
  @ApiProperty({ type: String, required: true })
  name: string;
}
