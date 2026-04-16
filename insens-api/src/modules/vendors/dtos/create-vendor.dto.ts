import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVendorDto {
  @ApiProperty({ example: 'Test Perfumes Pvt Ltd', maxLength: 255, description: 'Registered legal name of the business' })
  @IsString()
  @MaxLength(255)
  legalName!: string;

  @ApiProperty({ example: 'Test Perfumes', maxLength: 255, description: 'Public display name shown to customers' })
  @IsString()
  @MaxLength(255)
  displayName!: string;

  @ApiProperty({ example: 'test-perfumes', maxLength: 255, description: 'URL-friendly unique slug for the vendor page' })
  @IsString()
  @MaxLength(255)
  slug!: string;

  @ApiPropertyOptional({ example: 'vendor@testperfumes.com', description: 'Business contact email' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: '+919876543210', description: 'Business contact phone number' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: 'Premium curated perfume store specializing in niche fragrances' })
  @IsString()
  @IsOptional()
  description?: string;
}
