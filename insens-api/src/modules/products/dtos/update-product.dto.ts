import {
  IsArray, IsBoolean, IsInt, IsNumber, IsOptional, IsString, IsUrl, IsUUID, Min, MinLength,
} from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @MinLength(2)
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  stock?: number;

  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @IsArray()
  @IsUrl({}, { each: true })
  @IsOptional()
  images?: string[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
