import { create } from 'zustand';
import { DISCOVER_PRODUCTS } from '@/src/features/discover/config/discover.config';
import { LikedProduct } from '../types/liked.types';

interface LikedState {
  likedIds: string[];

  // Actions
  toggle: (id: string) => void;
  isLiked: (id: string) => boolean;
  getLikedProducts: () => LikedProduct[];
}

export const useLikedStore = create<LikedState>((set, get) => ({
  // Seed from discover config's initial isFavorited values
  likedIds: DISCOVER_PRODUCTS.filter((p) => p.isFavorited).map((p) => p.id),

  toggle: (id) =>
    set((state) => ({
      likedIds: state.likedIds.includes(id)
        ? state.likedIds.filter((i) => i !== id)
        : [...state.likedIds, id],
    })),

  isLiked: (id) => get().likedIds.includes(id),

  getLikedProducts: () =>
    DISCOVER_PRODUCTS.filter((p) => get().likedIds.includes(p.id)).map((p) => ({
      id: p.id,
      brand: p.brand,
      name: p.name,
      image: p.image,
    })),
}));
