import { IsArray, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  // @IsNumber()
  price: number;

  @IsString()
  previewImg: string;

  imgs: string[];

  @IsString()
  category: string;

  // fix add type
  simularProjects: any;

  @IsArray()
  colors: { name: string; rgb: string }[];

  // sizes?: string[];
  // description?: string;
}
