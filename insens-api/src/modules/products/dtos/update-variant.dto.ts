import { IsBoolean, IsInt, IsNumberString, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateVariantDto {
  @ApiPropertyOptional({ example: '50ml EDP' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ example: '50ml', description: 'Size label (free text)' })
  @IsString()
  @IsOptional()
  sizeLabel?: string;

  @ApiPropertyOptional({ example: 'tester' })
  @IsString()
  @IsOptional()
  packagingType?: string;

  @ApiPropertyOptional({ example: 'limited' })
  @IsString()
  @IsOptional()
  editionType?: string;

  @ApiPropertyOptional({ example: '8901234567890' })
  @IsString()
  @IsOptional()
  barcode?: string;

  @ApiPropertyOptional({ example: '3499.00', description: 'Updated MRP (decimal string)' })
  @IsNumberString()
  @IsOptional()
  mrp?: string;

  @ApiPropertyOptional({ example: '2999.00', description: 'Updated sale price (decimal string)' })
  @IsNumberString()
  @IsOptional()
  salePrice?: string;

  @ApiPropertyOptional({ example: '1500.00' })
  @IsNumberString()
  @IsOptional()
  costPrice?: string;

  @ApiPropertyOptional({ example: 100, minimum: 0, description: 'Updated stock quantity' })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  stock?: number;

  @ApiPropertyOptional({ example: 5, minimum: 0 })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  reorderThreshold?: number;

  @ApiPropertyOptional({ example: '250.00' })
  @IsNumberString()
  @IsOptional()
  weightGrams?: string;

  @ApiPropertyOptional({ example: '10.00' })
  @IsNumberString()
  @IsOptional()
  lengthCm?: string;

  @ApiPropertyOptional({ example: '5.00' })
  @IsNumberString()
  @IsOptional()
  widthCm?: string;

  @ApiPropertyOptional({ example: '12.00' })
  @IsNumberString()
  @IsOptional()
  heightCm?: string;

  @ApiPropertyOptional({ example: true, description: 'Whether this variant is available for purchase' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
