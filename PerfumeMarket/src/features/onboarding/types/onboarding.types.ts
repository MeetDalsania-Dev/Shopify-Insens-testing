// src/features/onboarding/types/onboarding.types.ts
export interface OnboardingState {
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}
export type UserRole = "visitor" | "seller";

export interface RoleOption {
  id: UserRole;
  label: string;
  description: string;
}
