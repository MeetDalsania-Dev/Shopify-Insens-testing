import { IsBoolean, IsInt, IsNumberString, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateVariantDto {
  @ApiPropertyOptional({ example: '3499.00', description: 'Updated MRP (decimal string)' })
  @IsNumberString()
  @IsOptional()
  mrp?: string;

  @ApiPropertyOptional({ example: '2999.00', description: 'Updated sale price (decimal string)' })
  @IsNumberString()
  @IsOptional()
  salePrice?: string;

  @ApiPropertyOptional({ example: 100, minimum: 0, description: 'Updated stock quantity' })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  stock?: number;

  @ApiPropertyOptional({ example: true, description: 'Whether this variant is available for purchase' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ example: '50ml EDP' })
  @IsString()
  @IsOptional()
  title?: string;
}
