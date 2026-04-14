import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '../../../common/constants/roles.constant';

/** INSENS_ADMIN can never self-register. */
const REGISTERABLE_ROLES = [UserRole.BUYER, UserRole.SHOP_OWNER] as const;
type RegisterableRole     = (typeof REGISTERABLE_ROLES)[number];

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsEnum(REGISTERABLE_ROLES)
  role!: RegisterableRole;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;
}
