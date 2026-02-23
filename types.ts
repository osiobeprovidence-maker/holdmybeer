
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
  LAGOS_ISLAND = 'Lagos Island',
  VICTORIA_ISLAND = 'Victoria Island',
  IKOYI = 'Ikoyi',
  LEKKI = 'Lekki',
  AJAH = 'Ajah',
  IKEJA = 'Ikeja',
  MARYLAND = 'Maryland',
  SURULERE = 'Surulere',
  YABA = 'Yaba',
  FESTAC = 'Festac',
  AMUWO_ODOFIN = 'Amuwo Odofin',
  IKORODU = 'Ikorodu',
  AGEGE = 'Agege',
  OJOTA = 'Ojota',
  KETU = 'Ketu',
  AJEGUNLE = 'Ajegunle',
  APAPA = 'Apapa'
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
  trialStartDate?: number;
  isPaid?: boolean;
  coins: number;
  // New Work Page fields
  completedJobs?: number;
  avgDeliveryTime?: string;
  topSkills?: string[];
  services?: string[];
  experience?: string;
  industries?: string[];
  socialLinks?: {
    instagram?: string;
    behance?: string;
    youtube?: string;
    tiktok?: string;
    portfolio?: string;
  };
}

export type Vendor = User;
