import { IsInt, IsNumberString, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVariantDto {
  @IsString()
  sku!: string;

  @IsString()
  @IsOptional()
  barcode?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsNumberString()
  mrp!: string;

  @IsNumberString()
  salePrice!: string;

  @IsNumberString()
  @IsOptional()
  costPrice?: string;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  stock?: number;
}
