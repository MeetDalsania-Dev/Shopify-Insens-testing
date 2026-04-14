import { ProductDetail } from '../types/product.types';

export const PRODUCTS_DETAIL: Record<string, ProductDetail> = {
  'ysl-homme': {
    id: 'ysl-homme',
    brand: 'Yves Saint Laurent',
    name: "Y L'Elixir",
    heroImage: require('@/assets/images/onboarding/slide2.jpg'),
    rating: 4.73,
    reviewCount: 896,
    location: 'Toronto, Ontario',
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    sizes: ['30ml', '50ml', '100ml'],
    topNotes: [
      { id: 'bergamot', name: 'Bergamot', emoji: '🍋' },
      { id: 'lemon', name: 'Lemon', emoji: '🍋' },
      { id: 'mandarin', name: 'Mandarin Orange', emoji: '🍊' },
      { id: 'grapefruit', name: 'Grapefruit', emoji: '🍊' },
    ],
    heartNotes: [
      { id: 'sage', name: 'Sage', emoji: '🌿' },
      { id: 'cedar', name: 'Cedar', emoji: '🌲' },
      { id: 'ginger', name: 'Ginger', emoji: '🌱' },
    ],
    baseNotes: [
      { id: 'vetiver', name: 'Vetiver', emoji: '🌾' },
      { id: 'tonka', name: 'Tonka Bean', emoji: '☕' },
      { id: 'ambergris', name: 'Ambergris', emoji: '🌊' },
    ],
    usageTags: [
      { id: 'cold', label: 'Cold', icon: 'cold' },
      { id: 'office', label: 'Office', icon: 'office' },
      { id: 'daily', label: 'Daily Use', icon: 'daily' },
    ],
    story:
      "Born from the bold vision of Yves Saint Laurent, Y L'Elixir is a modern masculine fragrance that embodies strength, elegance, and confidence. The scent opens with a burst of fresh citrus, evolves into a heart of aromatic spices, and settles into a warm, sensual base.",
  },
};

export function getProductDetail(id: string): ProductDetail | undefined {
  return PRODUCTS_DETAIL[id];
}
