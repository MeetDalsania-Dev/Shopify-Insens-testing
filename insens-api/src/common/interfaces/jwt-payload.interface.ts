export interface JwtPayload {
  /** userId */
  sub:      string;
  email:    string;
  roles:    string[];
  /** Populated after a vendor is linked to the user */
  vendorId: string | null;
  iat:      number;
  exp:      number;
}
