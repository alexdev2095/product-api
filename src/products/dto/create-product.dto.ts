import { IsString, IsUrl, IsNumber, IsNotEmpty } from 'class-validator';

class ProductDetails {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUrl()
  @IsNotEmpty()
  image: string;

  @IsNumber()
  @IsNotEmpty()
  stock: number;
}

export class CreateProductDto {
  @IsNotEmpty()
  product: ProductDetails;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsNumber()
  unitSold?: number;

  @IsNumber()
  revenue?: number;

  @IsNumber()
  conversion?: number;
}
