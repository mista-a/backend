import { IsNumber } from 'class-validator';

export class addToCartDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  count: number;

  @IsNumber()
  sizeId: number;
}
