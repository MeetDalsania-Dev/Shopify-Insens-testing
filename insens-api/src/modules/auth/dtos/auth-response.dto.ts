import { UserRole } from '../../../common/constants/roles.constant';

export class AuthUserDto {
  id!:        string;
  email!:     string;
  role!:      UserRole;
  firstName!: string | null;
  lastName!:  string | null;
  shopId!:    string | null;
}

export class AuthResponseDto {
  accessToken!:  string;
  refreshToken!: string;
  user!:         AuthUserDto;
}
