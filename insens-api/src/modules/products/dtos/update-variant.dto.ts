import { IsBoolean, IsInt, IsNumberString, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateVariantDto {
  @IsNumberString()
  @IsOptional()
  mrp?: string;

  @IsNumberString()
  @IsOptional()
  salePrice?: string;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  stock?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  title?: string;
}
