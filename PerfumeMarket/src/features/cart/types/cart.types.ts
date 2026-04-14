export interface CartItem {
  id: string;
  brand: string;
  name: string;
  image: ReturnType<typeof require>;
  price: number;
  quantity: number;
}
