import { IsNumber } from 'class-validator';

export class deleteFromCartDto {
  @IsNumber()
  cartItemId: number;

  @IsNumber()
  deleteProductsCounter: number;
}
