export interface RecyclerReview {
  id: string;
  author: string;
  activityType: 'PET drop-off' | 'Home pickup' | 'Cardboard pickup' | 'Drop-off';
  rating: number;
  comment: string;
  timeAgo: string;
}

export interface RecyclerRates {
  pet: number;
  hdpe: number;
  cans: number;
  carton: number;
}

export interface Recycler {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  licensed: boolean;
  distanceKm: number;
  address: string;
  replyTime: string;
  completedPickups: number;
  coordinates: {
    lat: number;
    lng: number;
    x: number; // visual map coordinate percentage
    y: number; // visual map coordinate percentage
  };
  rates: RecyclerRates;
  minPickupKg: number;
  minDropoffKg: number;
  pickupAvailable: boolean;
  dropoffAvailable: boolean;
  openToday: boolean;
  openingHours: string;
  serviceAreas: string[];
  image?: string;
  reviews: RecyclerReview[];
  reviewMetrics?: {
    fairWeighingPct: number;
    onTimePct: number;
    politePct: number;
  };
}

export type RecyclerFilter = 'all' | 'pickup' | 'dropoff' | 'open';
export type RecyclerSort = 'best_match' | 'best_rate' | 'nearest';
