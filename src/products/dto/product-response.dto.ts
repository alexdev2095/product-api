import { ApiProperty } from '@nestjs/swagger';

class ProductDetailsResponse {
  @ApiProperty()
  name: string;

  @ApiProperty()
  image: string;

  @ApiProperty()
  stock: number;
}

export class ProductResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  product: ProductDetailsResponse;

  @ApiProperty()
  category: string;

  @ApiProperty()
  unitSold: number;

  @ApiProperty()
  revenue: number;

  @ApiProperty()
  conversion: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
