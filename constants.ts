
import { User, Category, Location } from './types';

export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Tunde Spinny',
    email: 'djspinny@example.com',
    isCreator: true,
    location: Location.LAGOS,
    kycVerified: true,
    kycStatus: 'verified',
    businessName: 'Spinny Entertainment',
    category: Category.DJ,
    priceRange: [150000, 500000],
    bio: 'High-energy DJ for weddings and corporate events. I specialize in keeping the dance floor packed all night.',
    portfolio: ['https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=1200&auto=format'],
    // Fix: Removed non-existent property availableNow
    availableToday: true,
    isVerified: true,
    phone: '+234 801 234 5678',
    avatar: 'https://i.pravatar.cc/150?u=1',
    reliabilityScore: 98,
    totalUnlocks: 142,
    infrastructuralRank: 95,
    ratingAvg: 4.8
  },
  {
    id: '2',
    name: 'Amaka Chef',
    email: 'amaka@example.com',
    isCreator: true,
    location: Location.ABUJA,
    kycVerified: true,
    kycStatus: 'verified',
    businessName: "Amaka's Culinary",
    category: Category.CATERER,
    priceRange: [3000, 8000],
    bio: 'Professional catering for last-minute office lunches or private dinners. Quality guaranteed.',
    portfolio: ['https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1200&auto=format'],
    // Fix: Removed non-existent property availableNow
    availableToday: false,
    isVerified: true,
    phone: '+234 703 111 2222',
    avatar: 'https://i.pravatar.cc/150?u=2',
    reliabilityScore: 95,
    totalUnlocks: 89,
    infrastructuralRank: 92,
    ratingAvg: 4.7
  },
  {
    id: '3',
    name: 'Obi Lense',
    email: 'obi@example.com',
    isCreator: true,
    location: Location.PORT_HARCOURT,
    kycVerified: false,
    kycStatus: 'unverified',
    businessName: 'Obi Lense Studio',
    category: Category.PHOTOGRAPHER,
    priceRange: [80000, 300000],
    bio: 'Capturing events as they happen. Quick turnaround time for photos.',
    portfolio: ['https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format'],
    // Fix: Removed non-existent property availableNow
    availableToday: true,
    isVerified: false,
    phone: '+234 902 444 5555',
    avatar: 'https://i.pravatar.cc/150?u=3',
    reliabilityScore: 82,
    totalUnlocks: 45,
    infrastructuralRank: 78,
    ratingAvg: 4.2
  }
];
