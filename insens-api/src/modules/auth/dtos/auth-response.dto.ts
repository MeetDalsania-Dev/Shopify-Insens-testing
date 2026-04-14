export class AuthUserDto {
  id!:        string;
  email!:     string;
  roles!:     string[];
  firstName!: string | null;
  lastName!:  string | null;
  vendorId!:  string | null;
}

export class AuthResponseDto {
  accessToken!:  string;
  refreshToken!: string;
  user!:         AuthUserDto;
}
