import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateVendorDto {
  @IsString()
  @MaxLength(255)
  legalName!: string;

  @IsString()
  @MaxLength(255)
  displayName!: string;

  @IsString()
  @MaxLength(255)
  slug!: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
