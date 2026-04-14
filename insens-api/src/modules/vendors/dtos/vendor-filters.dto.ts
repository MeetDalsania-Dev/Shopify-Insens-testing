import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class VendorFiltersDto {
  @IsString()
  @IsIn(['pending', 'active', 'suspended', 'rejected'])
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  page?: number = 1;

  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  @IsOptional()
  limit?: number = 20;
}
