import { ApiProperty } from '@nestjs/swagger';
import { MembershipLevel } from './MembershipLevel.enum';

export class CustomerMemberDetailsResponseDto {
  @ApiProperty({ enum: MembershipLevel, required: true })
  memberShipLevel: MembershipLevel;
  @ApiProperty({ type: Number, required: true })
  discountRate: number;
}
export class CustomerDetailsResponseDto {
  @ApiProperty({ type: Number, required: true })
  id: number;

  @ApiProperty({ type: String, required: true })
  email: string;

  @ApiProperty({ type: String, required: true })
  firstName: string;

  @ApiProperty({ type: String, required: true })
  lastName: string;

  @ApiProperty({ type: String, required: true })
  fullName: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  phone: string | null;

  @ApiProperty({ type: CustomerMemberDetailsResponseDto, required: true })
  memberDetails: CustomerMemberDetailsResponseDto;
}
