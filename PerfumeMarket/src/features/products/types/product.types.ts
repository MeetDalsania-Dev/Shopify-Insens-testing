export interface ScentNote {
  id: string;
  name: string;
  emoji: string;
}

export interface ProductDetail {
  id: string;
  brand: string;
  name: string;
  heroImage: ReturnType<typeof require>;
  rating: number;
  reviewCount: number;
  location: string;
  description: string;
  sizes: string[];
  topNotes: ScentNote[];
  heartNotes: ScentNote[];
  baseNotes: ScentNote[];
  usageTags: UsageTag[];
  story: string;
}

export interface UsageTag {
  id: string;
  label: string;
  icon: 'cold' | 'office' | 'daily' | 'night' | 'sport';
}
