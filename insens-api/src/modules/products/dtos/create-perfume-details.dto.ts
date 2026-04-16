import { IsBoolean, IsInt, IsNumberString, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePerfumeDetailsDto {
  @ApiPropertyOptional({ example: 'woody,floral', description: 'Comma-separated fragrance families' })
  @IsString()
  @IsOptional()
  fragranceFamily?: string;

  @ApiPropertyOptional({ example: 'edp', description: 'Concentration type' })
  @IsString()
  @IsOptional()
  concentration?: string;

  @ApiPropertyOptional({ example: 'unisex', enum: ['men', 'women', 'unisex'] })
  @IsString()
  @IsOptional()
  genderTarget?: string;

  @ApiPropertyOptional({ example: 'bergamot,lemon', description: 'Comma-separated top notes' })
  @IsString()
  @IsOptional()
  topNotes?: string;

  @ApiPropertyOptional({ example: 'rose,jasmine', description: 'Comma-separated middle notes' })
  @IsString()
  @IsOptional()
  middleNotes?: string;

  @ApiPropertyOptional({ example: 'oud,sandalwood', description: 'Comma-separated base notes' })
  @IsString()
  @IsOptional()
  baseNotes?: string;

  @ApiPropertyOptional({ example: 'daily,office', description: 'Comma-separated occasion tags' })
  @IsString()
  @IsOptional()
  occasionTags?: string;

  @ApiPropertyOptional({ example: 'autumn,winter', description: 'Comma-separated season tags' })
  @IsString()
  @IsOptional()
  seasonTags?: string;

  @ApiPropertyOptional({ example: 4, minimum: 1, maximum: 5 })
  @IsNumberString()
  @IsOptional()
  longevityScore?: string;

  @ApiPropertyOptional({ example: 3, minimum: 1, maximum: 5 })
  @IsNumberString()
  @IsOptional()
  projectionScore?: string;

  @ApiPropertyOptional({ example: 'A journey through the souks of Marrakech...' })
  @IsString()
  @IsOptional()
  scentStory?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  handcrafted?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  crueltyFree?: boolean;

  @ApiPropertyOptional({ example: 2019 })
  @IsInt()
  @Min(1900)
  @Max(2100)
  @Type(() => Number)
  @IsOptional()
  launchYear?: number;

  @ApiPropertyOptional({ example: 'Intense Edition' })
  @IsString()
  @IsOptional()
  editionName?: string;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  discontinued?: boolean;

  @ApiPropertyOptional({ example: 'BATCH-2024-001' })
  @IsString()
  @IsOptional()
  batchNumber?: string;

  @ApiPropertyOptional({ example: 'FORMULA-REF-42' })
  @IsString()
  @IsOptional()
  formulaRef?: string;

  @ApiPropertyOptional({ example: 'https://example.com/proof.pdf' })
  @IsString()
  @IsOptional()
  brandAuthorizationProof?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  authorizedSellerDeclaration?: boolean;
}
