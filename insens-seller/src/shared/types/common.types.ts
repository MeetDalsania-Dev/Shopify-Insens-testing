export type ShopStatus = "PENDING" | "APPROVED" | "SUSPENDED";
export type UserRole  = "INSENS_ADMIN" | "SHOP_OWNER" | "BUYER";

export interface SelectOption {
  value: string;
  label: string;
}
