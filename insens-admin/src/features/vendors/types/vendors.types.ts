export interface Vendor {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  address: string | null;
  city: string | null;
  logoUrl: string | null;
  status: 'APPROVED';
  createdAt: string;
  updatedAt: string;
  owner: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    createdAt: string;
  };
}
