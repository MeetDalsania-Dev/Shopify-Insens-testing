import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class VendorFiltersDto {
  @ApiPropertyOptional({ enum: ['pending', 'active', 'suspended', 'rejected'], description: 'Filter by vendor status' })
  @IsString()
  @IsIn(['pending', 'active', 'suspended', 'rejected'])
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ example: 'Mumbai', description: 'Filter by city' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({ default: 1, minimum: 1, description: 'Page number' })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ default: 20, minimum: 1, maximum: 100, description: 'Items per page' })
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  @IsOptional()
  limit?: number = 20;
}
