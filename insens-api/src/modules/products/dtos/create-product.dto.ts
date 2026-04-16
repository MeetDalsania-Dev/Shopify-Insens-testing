import { IsArray, IsIn, IsOptional, IsString, IsUUID, MaxLength, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreatePerfumeDetailsDto } from './create-perfume-details.dto';
import { CreateVariantDto } from './create-variant.dto';

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

  @ApiPropertyOptional({ example: 'branded_perfume', enum: ['custom_perfume', 'branded_perfume', 'decant_sample', 'gift_set'] })
  @IsString()
  @IsOptional()
  listingType?: string;

  @ApiPropertyOptional({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', description: 'Category UUID' })
  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional({ example: 'b2c3d4e5-f6a7-8901-bcde-f12345678901', description: 'Brand UUID' })
  @IsUUID()
  @IsOptional()
  brandId?: string;

  @ApiPropertyOptional({ example: 'France', description: 'Country of origin (full name)' })
  @IsString()
  @IsOptional()
  originCountry?: string;

  @ApiPropertyOptional({ example: '["oud","oriental"]', description: 'JSON-stringified tags array' })
  @IsString()
  @IsOptional()
  tags?: string;

  @ApiPropertyOptional({ example: 'https://example.com/video.mp4' })
  @IsString()
  @IsOptional()
  productVideo?: string;

  @ApiPropertyOptional({ example: 'https://example.com/360.jpg' })
  @IsString()
  @IsOptional()
  view360?: string;

  @ApiPropertyOptional({ enum: ['draft', 'pending_review'], default: 'draft' })
  @IsIn(['draft', 'pending_review'])
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ description: 'Perfume-specific details' })
  @ValidateNested()
  @Type(() => CreatePerfumeDetailsDto)
  @IsOptional()
  perfumeDetails?: CreatePerfumeDetailsDto;

  @ApiPropertyOptional({ description: 'Variants to create along with the product' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVariantDto)
  @IsOptional()
  variants?: CreateVariantDto[];
}
