export type DiscoverCategory =
  | 'All'
  | 'For Her'
  | 'For Him'
  | 'Unisex'
  | 'Luxury'
  | 'Daily Wear'
  | 'Gift Sets';

export interface DiscoverProduct {
  id: string;
  brand: string;
  name: string;
  image: ReturnType<typeof require>;
  isFavorited: boolean;
}
