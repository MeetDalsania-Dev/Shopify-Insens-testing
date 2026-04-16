import { IsInt, IsNumberString, IsOptional, IsString, Min } from 'class-validator';
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

  @ApiPropertyOptional({ example: '100ml EDT', description: 'Variant display title (e.g. size + concentration)' })
  @IsString()
  @IsOptional()
  title?: string;

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
}
