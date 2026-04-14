import { UserRole } from '../constants/roles.constant';

export interface JwtPayload {
  /** userId */
  sub:    string;
  email:  string;
  role:   UserRole;
  /** Populated only for SHOP_OWNER after onboarding */
  shopId: string | null;
  iat:    number;
  exp:    number;
}
