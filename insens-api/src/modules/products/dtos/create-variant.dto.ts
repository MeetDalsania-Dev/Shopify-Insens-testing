import { IsBoolean, IsInt, IsNumberString, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVariantDto {
  @ApiProperty({ example: 'OUD-100ML-EDT', description: 'Unique SKU / stock keeping unit code' })
  @IsString()
  sku!: string;

  @ApiPropertyOptional({ example: '8901234567890', description: 'Barcode / EAN' })
  @IsString()
  @IsOptional()
  barcode?: string;

  @ApiPropertyOptional({ example: '100ml EDT', description: 'Variant display title (e.g. label entered by seller)' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ example: '100ml', description: 'Size label (free text — e.g. 50ml, travel size)' })
  @IsString()
  @IsOptional()
  sizeLabel?: string;

  @ApiPropertyOptional({ example: 'full_bottle', description: 'Packaging type (full_bottle, tester, decant, etc.)' })
  @IsString()
  @IsOptional()
  packagingType?: string;

  @ApiPropertyOptional({ example: 'standard', description: 'Edition type (standard, limited, collector, etc.)' })
  @IsString()
  @IsOptional()
  editionType?: string;

  @ApiProperty({ example: '2999.00', description: 'Maximum retail price (decimal string)' })
  @IsNumberString()
  mrp!: string;

  @ApiProperty({ example: '2499.00', description: 'Sale / selling price (decimal string)' })
  @IsNumberString()
  salePrice!: string;

  @ApiPropertyOptional({ example: '1200.00', description: 'Cost / purchase price (decimal string)' })
  @IsNumberString()
  @IsOptional()
  costPrice?: string;

  @ApiPropertyOptional({ example: 50, minimum: 0, description: 'Available stock quantity' })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  stock?: number;

  @ApiPropertyOptional({ example: 10, minimum: 0, description: 'Reorder threshold — alert when stock falls below this' })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  reorderThreshold?: number;

  @ApiPropertyOptional({ example: '250.00', description: 'Weight in grams (decimal string)' })
  @IsNumberString()
  @IsOptional()
  weightGrams?: string;

  @ApiPropertyOptional({ example: '10.00', description: 'Length in cm (decimal string)' })
  @IsNumberString()
  @IsOptional()
  lengthCm?: string;

  @ApiPropertyOptional({ example: '5.00', description: 'Width in cm (decimal string)' })
  @IsNumberString()
  @IsOptional()
  widthCm?: string;

  @ApiPropertyOptional({ example: '12.00', description: 'Height in cm (decimal string)' })
  @IsNumberString()
  @IsOptional()
  heightCm?: string;

  @ApiPropertyOptional({ example: true, description: 'Whether this variant is available for purchase' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
