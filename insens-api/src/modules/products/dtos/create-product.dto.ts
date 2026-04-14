import {
  IsArray, IsInt, IsNumber, IsOptional, IsString, IsUrl, IsUUID, Min, MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsInt()
  @Min(0)
  stock!: number;

  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @IsArray()
  @IsUrl({}, { each: true })
  @IsOptional()
  images?: string[];
}
