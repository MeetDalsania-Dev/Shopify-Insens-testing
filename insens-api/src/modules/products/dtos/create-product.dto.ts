import { IsIn, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Oud Wood 100ml', minLength: 2, maxLength: 255, description: 'Product title' })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  title!: string;

  @ApiProperty({ example: 'oud-wood-100ml', maxLength: 300, description: 'URL-friendly unique slug' })
  @IsString()
  @MaxLength(300)
  slug!: string;

  @ApiPropertyOptional({ example: 'A rich oud fragrance with woody notes', description: 'Short description for listings' })
  @IsString()
  @IsOptional()
  shortDescription?: string;

  @ApiPropertyOptional({ example: 'Full description with notes, longevity, and usage tips' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ enum: ['simple', 'variant', 'bundle'], default: 'simple' })
  @IsIn(['simple', 'variant', 'bundle'])
  @IsOptional()
  productType?: string;

  @ApiPropertyOptional({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', description: 'Category UUID' })
  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional({ example: 'b2c3d4e5-f6a7-8901-bcde-f12345678901', description: 'Brand UUID' })
  @IsUUID()
  @IsOptional()
  brandId?: string;
}
