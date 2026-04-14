import { DailySuggestion, NewArrival } from '../types/home.types';

// Replace these with actual product images
// e.g. require('@/assets/images/products/ysl-elixir.jpg')
export const DAILY_SUGGESTIONS: DailySuggestion[] = [
  {
    id: 'ysl-elixir',
    brand: 'Yves Saint Laurent',
    name: "Yves Saint Laurent Y L'Elixir 60ml",
    image: require('@/assets/images/onboarding/slide1.jpg'),
    gender: 'Male',
    year: 1992,
  },
  {
    id: 'lacoste-homme',
    brand: 'Lacoste',
    name: "Lacoste L'Homme Eau de Toilette",
    image: require('@/assets/images/onboarding/slide2.jpg'),
    gender: 'Male',
    year: 1992,
  },
];

export const NEW_ARRIVALS: NewArrival[] = [
  {
    id: 'lacoste',
    brand: 'Lacoste',
    image: require('@/assets/images/onboarding/slide1.jpg'),
  },
  {
    id: 'prada',
    brand: 'Prada',
    image: require('@/assets/images/onboarding/slide2.jpg'),
  },
  {
    id: 'gucci',
    brand: 'Gucci',
    image: require('@/assets/images/onboarding/slide3.jpg'),
  },
];
