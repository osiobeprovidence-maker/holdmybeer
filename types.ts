
export enum Category {
  DJ = 'DJ',
  PHOTOGRAPHER = 'Photographer',
  CATERER = 'Caterer',
  MC = 'MC',
  DECORATOR = 'Decorator',
  SOUND = 'Sound System',
  BARTENDER = 'Bartender',
  VENUE = 'Venue'
}

export enum Location {
  LAGOS = 'Lagos',
  ABUJA = 'Abuja',
  PORT_HARCOURT = 'Port Harcourt',
  IBADAN = 'Ibadan',
 Kano = 'Kano',
  BENIN_CITY = 'Benin City',
  ENUGU = 'Enugu',
  WARRI = 'Warri',
  CALABAR = 'Calabar'
}

export type IDType = 'NIN' | 'Driver License' | 'PVC' | 'International Passport' | 'BVN';

export interface ServiceRequest {
  id: string;
  clientId: string;
  creatorId: string;
  status: 'unlocked' | 'contacted' | 'completed';
  amount: number;
  paymentType: 'standard' | 'urgent';
  timestamp: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isCreator: boolean;
  avatar?: string;
  location: Location;
  kycVerified: boolean;
  kycStatus: 'unverified' | 'verified';
  phone?: string;
  kycType?: IDType;
  kycNumber?: string;
  // Professional details
  businessName?: string;
  category?: Category;
  bio?: string;
  portfolio?: string[];
  priceRange?: [number, number];
  availableToday?: boolean;
  availableDays?: string[]; // e.g. ["Mon", "Fri", "Sat"]
  isVerified?: boolean;
  reliabilityScore?: number;
  totalUnlocks?: number;
  infrastructuralRank?: number;
  ratingAvg?: number;
  isSuspended?: boolean;
}

export type Vendor = User;
