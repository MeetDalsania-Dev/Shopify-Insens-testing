export interface DailySuggestion {
  id: string;
  brand: string;
  name: string;
  image: ReturnType<typeof require>;
  gender: 'Male' | 'Female' | 'Unisex';
  year: number;
}

export interface NewArrival {
  id: string;
  brand: string;
  image: ReturnType<typeof require>;
}
