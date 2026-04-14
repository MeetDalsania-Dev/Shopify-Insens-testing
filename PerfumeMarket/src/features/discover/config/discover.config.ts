import { DiscoverCategory, DiscoverProduct } from '../types/discover.types';

export const DISCOVER_CATEGORIES: DiscoverCategory[] = [
  'All',
  'For Her',
  'For Him',
  'Unisex',
  'Luxury',
  'Daily Wear',
  'Gift Sets',
];

// Replace images with actual product photos
export const DISCOVER_PRODUCTS: DiscoverProduct[] = [
  {
    id: 'lacoste-homme',
    brand: 'Lacoste',
    name: 'Homme Eau de Toilette',
    image: require('@/assets/images/onboarding/slide1.jpg'),
    isFavorited: false,
  },
  {
    id: 'ysl-homme',
    brand: 'Yves Saint Laurent',
    name: 'Y L\'Elixir Eau de Parfum',
    image: require('@/assets/images/onboarding/slide2.jpg'),
    isFavorited: true,
  },
  {
    id: 'narciso-homme',
    brand: 'Narciso Rodriguez',
    name: 'Homme Eau de Toilette',
    image: require('@/assets/images/onboarding/slide3.jpg'),
    isFavorited: true,
  },
  {
    id: 'dg-light-blue',
    brand: 'Dolce&Gabbana',
    name: 'Light Blue Eau de Toilette',
    image: require('@/assets/images/onboarding/slide1.jpg'),
    isFavorited: false,
  },
  {
    id: 'dg-the-one',
    brand: 'Dolce&Gabbana',
    name: 'The One Eau de Parfum',
    image: require('@/assets/images/onboarding/slide2.jpg'),
    isFavorited: true,
  },
  {
    id: 'dg-k',
    brand: 'Dolce&Gabbana',
    name: 'K Eau de Toilette',
    image: require('@/assets/images/onboarding/slide3.jpg'),
    isFavorited: false,
  },
];
