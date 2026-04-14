import { IsOptional, IsString, IsUrl, MinLength } from 'class-validator';

export class CreateShopDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsUrl()
  @IsOptional()
  logoUrl?: string;
}
