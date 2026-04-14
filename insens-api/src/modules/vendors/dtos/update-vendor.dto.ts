import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateVendorDto {
  @IsString()
  @MaxLength(255)
  @IsOptional()
  displayName?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  logoUrl?: string;

  @IsString()
  @IsOptional()
  bannerUrl?: string;
}
