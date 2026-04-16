import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

// No body required for approve/suspend — action is encoded in the route.
// This DTO exists for future action payloads (e.g. suspension reason).
export class VendorActionDto {
  @ApiPropertyOptional({ example: 'Repeated policy violations', description: 'Reason for the action (optional)' })
  @IsString()
  @IsOptional()
  reason?: string;
}
