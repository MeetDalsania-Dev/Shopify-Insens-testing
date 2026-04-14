import { create } from 'zustand';
import { CartItem } from '../types/cart.types';

// Mock initial cart items — replace with API integration
const INITIAL_ITEMS: CartItem[] = [
  {
    id: 'ysl-elixir-60',
    brand: 'Yves Saint Laurent',
    name: "Yves Saint Laurent Y L'Elixir 60ml",
    image: require('@/assets/images/onboarding/slide1.jpg'),
    price: 120.99,
    quantity: 1,
  },
  {
    id: 'ysl-elixir-100',
    brand: 'Yves Saint Laurent',
    name: "Yves Saint Laurent Y L'Elixir 60ml",
    image: require('@/assets/images/onboarding/slide2.jpg'),
    price: 150.99,
    quantity: 1,
  },
  {
    id: 'ysl-elixir-30',
    brand: 'Yves Saint Laurent',
    name: "Yves Saint Laurent Y L'Elixir 60ml",
    image: require('@/assets/images/onboarding/slide3.jpg'),
    price: 130.99,
    quantity: 1,
  },
  {
    id: 'ysl-elixir-50',
    brand: 'Yves Saint Laurent',
    name: "Yves Saint Laurent Y L'Elixir 60ml",
    image: require('@/assets/images/onboarding/slide1.jpg'),
    price: 160.99,
    quantity: 1,
  },
];

interface CartState {
  items: CartItem[];

  // Actions
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  clearCart: () => void;

  // Selectors
  totalAmount: () => number;
  totalItems: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: INITIAL_ITEMS,

  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.id === item.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { ...item, quantity: 1 }] };
    }),

  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

  increment: (id) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id ? { ...i, quantity: i.quantity + 1 } : i
      ),
    })),

  decrement: (id) =>
    set((state) => ({
      items: state.items
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0),
    })),

  clearCart: () => set({ items: [] }),

  totalAmount: () =>
    get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

  totalItems: () =>
    get().items.reduce((sum, i) => sum + i.quantity, 0),
}));
