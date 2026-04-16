export interface CreateShopPayload {
  legalName:    string;
  displayName:  string;
  slug:         string;
  description?: string;
  email?:       string;
  phone?:       string;
}

export interface CreatedShop {
  id:             string;
  slug:           string;
  legalName:      string;
  displayName:    string;
  status:         string;
  approvalStatus: string;
  createdAt:      string;
}
