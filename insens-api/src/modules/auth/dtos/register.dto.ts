import { IsEmail, IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Test1234!', description: 'Password (min 8 characters)', minLength: 8 })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiPropertyOptional({ example: 'John' })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({
    example: 'vendor_owner',
    description: 'Role to assign at registration. Accepted values: vendor_owner, customer. Defaults to customer.',
    enum: ['vendor_owner', 'customer'],
  })
  @IsString()
  @IsOptional()
  @IsIn(['vendor_owner', 'customer'])
  role?: string;
}
