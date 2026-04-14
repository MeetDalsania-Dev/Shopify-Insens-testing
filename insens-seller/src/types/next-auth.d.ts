import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken:  string;
    refreshToken: string;
    shopId:       string | null;
    user: {
      id:        string;
      email:     string;
      role:      string;
      firstName: string;
      lastName:  string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id:           string;
    role:         string;
    shopId:       string | null;
    firstName:    string;
    lastName:     string;
    accessToken:  string;
    refreshToken: string;
  }
}
