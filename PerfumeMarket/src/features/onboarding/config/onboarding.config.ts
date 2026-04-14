// src/features/onboarding/config/onboarding.config.ts

export interface OnboardingSlide {
  id: string;
  image: ReturnType<typeof require>;
  title: string;
  description: string;
  isLast: boolean;
}

export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: "find-scent",
    image: require("@/assets/images/onboarding/slide1.jpg"),
    title: "Find Your Scent",
    description:
      "Discover the fragrance that best reflects your personality and lifestyle with expert-guided recommendations.",
    isLast: false,
  },
  {
    id: "match-fragrance",
    image: require("@/assets/images/onboarding/slide2.jpg"),
    title: "Match With Fragrance",
    description:
      "Take a short quiz to unlock personalized perfume matches based on your unique scent profile.",
    isLast: false,
  },
  {
    id: "elevate-essence",
    image: require("@/assets/images/onboarding/slide3.jpg"),
    title: "Elevate Your Essence",
    description:
      "Explore curated perfume collections designed for every mood, season, and special moment.",
    isLast: true,
  },
];
