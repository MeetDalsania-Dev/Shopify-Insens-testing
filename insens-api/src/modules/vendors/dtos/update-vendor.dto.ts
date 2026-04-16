import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateVendorDto {
  @ApiPropertyOptional({ example: 'Updated Perfumes', maxLength: 255 })
  @IsString()
  @MaxLength(255)
  @IsOptional()
  displayName?: string;

  @ApiPropertyOptional({ example: 'contact@updatedperfumes.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: '+919876543210' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: 'Updated store description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/logo.png', description: 'URL of vendor logo image' })
  @IsString()
  @IsOptional()
  logoUrl?: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/banner.jpg', description: 'URL of vendor banner image' })
  @IsString()
  @IsOptional()
  bannerUrl?: string;
}
