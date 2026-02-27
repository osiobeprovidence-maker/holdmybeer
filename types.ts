
export enum Category {
  // TALENT & ENTERTAINMENT
  MC = 'MC (Master of Ceremony)',
  DJ = 'DJs',
  LIVE_BAND = 'Live Bands',
  SAXOPHONIST = 'Saxophonists',
  HYPE_MAN = 'Hype Men',
  USHER = 'Ushers',
  COMEDIAN = 'Comedians',
  CULTURAL_DANCER = 'Cultural Dancers',
  CHOREOGRAPHER = 'Choreographers',
  KIDS_ENTERTAINER = 'Kids Entertainers',
  FACE_PAINTER = 'Face Painters',
  MAGICIAN = 'Magicians',
  SPOKEN_WORD = 'Spoken Word Artists',
  CELEBRITY_APPEARANCE = 'Celebrity Appearances',

  // SECURITY & CROWD CONTROL
  BOUNCER = 'Bouncers',
  SECURITY_TEAM = 'Event Security Teams',
  VIP_BODYGUARD = 'VIP Bodyguards',
  CROWD_CONTROL = 'Crowd Control Officers',
  ACCESS_CONTROL = 'Access Control Personnel',
  TICKET_CHECKER = 'Ticket Checkers',
  ARMED_ESCORT = 'Armed Escort',

  // DECOR & EVENT STYLING
  DECORATOR = 'Event Decorators',
  BALLOON_ARTIST = 'Balloon Artists',
  FLORAL_DESIGNER = 'Floral Designers',
  STAGE_DESIGNER = 'Stage Designers',
  LIGHTING_DESIGNER = 'Lighting Designers',
  BACKDROP_DESIGNER = 'Backdrop Designers',
  TABLE_STYLING = 'Table Styling Experts',
  THRONE_CHAIR_RENTAL = 'Throne Chair Rentals',
  CARPET_RUG_RENTAL = 'Carpet & Rug Rentals',
  THEMED_PARTY_DESIGNER = 'Themed Party Designers',

  // RENTALS & EQUIPMENT
  TENT_RENTAL = 'Tent Rentals',
  CHAIR_TABLE_RENTAL = 'Chairs & Tables',
  SOUND = 'Sound Systems',
  PA_SYSTEM = 'Public Address Systems',
  LED_SCREEN = 'LED Screens',
  PROJECTOR = 'Projectors',
  GENERATOR = 'Generators',
  STAGE_PLATFORM = 'Stage Platforms',
  DANCE_FLOOR = 'Dance Floors',
  COOLING_FAN = 'Cooling Fans',
  AC_UNIT = 'Air Conditioning Units',
  CABLING_SERVICE = 'Extension & Cabling Services',

  // LOGISTICS & MOBILE SUPPORT
  ICE_SUPPLIER = 'Ice Suppliers',
  ICE_TRUCK = 'Ice Trucks',
  COOLING_VAN = 'Cooling Vans',
  MOBILE_TOILET = 'Mobile Toilets',
  MOBILE_BAR_TRUCK = 'Mobile Bar Trucks',
  DELIVERY_VAN = 'Equipment Delivery Vans',
  SETUP_CREW = 'Movers & Setup Crew',
  POWER_BACKUP = 'Power Backup Services',

  // FOOD & DRINKS
  CATERER = 'Caterers',
  SMALL_CHOPS = 'Small Chops Vendors',
  MIXOLOGIST = 'Cocktail Mixologists',
  BARTENDER = 'Bartenders',
  BBQ_GRILL = 'BBQ / Grill Vendors',
  SHAWARMA_STAND = 'Shawarma Stands',
  FOOD_TRUCK = 'Food Trucks',
  CAKE_VENDOR = 'Cake Vendors',
  PALM_WINE = 'Palm Wine Suppliers',
  CHAMPAGNE_SERVICE = 'Champagne Service',
  MOCKTAIL_SPECIALIST = 'Mocktail Specialists',

  // MEDIA & COVERAGE
  PHOTOGRAPHER = 'Photographers',
  VIDEOGRAPHER = 'Videographers',
  DRONE_OPERATOR = 'Drone Operators',
  BOOTH_360 = '360 Booth Rentals',
  PHOTO_BOOTH = 'Instant Photo Print Booths',
  LIVE_STREAMING = 'Live Streaming Services',
  CONTENT_CREATOR = 'Event Content Creators',
  RED_CARPET_SETUP = 'Red Carpet Interview Setup',

  // BEAUTY & PERSONAL PREP
  MAKEUP_ARTIST = 'Makeup Artists',
  BRIDAL_MAKEUP = 'Bridal Makeup Specialists',
  HAIRSTYLIST = 'Hairstylists',
  BARBER = 'Barbers',
  GELE_TIER = 'Gele Tiers',
  NAIL_TECH = 'Nail Technicians',
  STYLIST = 'Stylists',
  FASHION_RENTAL = 'Fashion Rentals',
  WARDROBE_ASSISTANT = 'Wardrobe Assistants',
  GROOM_STYLING = 'Groom Styling Experts',

  // TRANSPORT & ACCESS
  CHAUFFEUR = 'Chauffeur Services',
  LUXURY_CAR_RENTAL = 'Luxury Car Rentals',
  PARTY_BUS = 'Party Buses',
  DISPATCH_RIDER = 'Dispatch Riders',
  VALET_SERVICE = 'Valet Services',

  // VENUES & EVENT SPACES
  VENUE = 'Event Halls',
  OUTDOOR_SPACE = 'Outdoor Spaces',
  ROOFTOP_VENUE = 'Rooftop Venues',
  BEACH_VENUE = 'Beach Venues',
  PRIVATE_APARTMENT = 'Private Party Apartments',
  CONFERENCE_CENTER = 'Conference Centers',
  POPUP_SPACE = 'Pop-up Event Spaces',

  // SPECIAL SERVICES
  EVENT_PLANNER = 'Event Planners',
  PROPOSAL_PLANNER = 'Proposal Planners',
  SURPRISE_SETUP = 'Surprise Setup Teams',
  CLEANUP_CREW = 'Event Clean-up Crew',
  WAITER = 'Waiters / Service Staff',
  TICKETING = 'Ticketing Services',
  INSURANCE = 'Event Insurance',
  STAGE_MANAGER = 'Stage Managers',
  HOSTESS = 'Hostesses'
}

export const CATEGORY_GROUPS = {
  "Talent & Entertainment": [
    Category.MC, Category.DJ, Category.LIVE_BAND, Category.SAXOPHONIST,
    Category.HYPE_MAN, Category.USHER, Category.COMEDIAN, Category.CULTURAL_DANCER,
    Category.CHOREOGRAPHER, Category.KIDS_ENTERTAINER, Category.FACE_PAINTER,
    Category.MAGICIAN, Category.SPOKEN_WORD, Category.CELEBRITY_APPEARANCE
  ],
  "Security & Crowd Control": [
    Category.BOUNCER, Category.SECURITY_TEAM, Category.VIP_BODYGUARD,
    Category.CROWD_CONTROL, Category.ACCESS_CONTROL, Category.TICKET_CHECKER,
    Category.ARMED_ESCORT
  ],
  "Decor & Event Styling": [
    Category.DECORATOR, Category.BALLOON_ARTIST, Category.FLORAL_DESIGNER,
    Category.STAGE_DESIGNER, Category.LIGHTING_DESIGNER, Category.BACKDROP_DESIGNER,
    Category.TABLE_STYLING, Category.THRONE_CHAIR_RENTAL, Category.CARPET_RUG_RENTAL,
    Category.THEMED_PARTY_DESIGNER
  ],
  "Rentals & Equipment": [
    Category.TENT_RENTAL, Category.CHAIR_TABLE_RENTAL, Category.SOUND,
    Category.PA_SYSTEM, Category.LED_SCREEN, Category.PROJECTOR,
    Category.GENERATOR, Category.STAGE_PLATFORM, Category.DANCE_FLOOR,
    Category.COOLING_FAN, Category.AC_UNIT, Category.CABLING_SERVICE
  ],
  "Logistics & Mobile Support": [
    Category.ICE_SUPPLIER, Category.ICE_TRUCK, Category.COOLING_VAN,
    Category.MOBILE_TOILET, Category.MOBILE_BAR_TRUCK, Category.DELIVERY_VAN,
    Category.SETUP_CREW, Category.POWER_BACKUP
  ],
  "Food & Drinks": [
    Category.CATERER, Category.SMALL_CHOPS, Category.MIXOLOGIST,
    Category.BARTENDER, Category.BBQ_GRILL, Category.SHAWARMA_STAND,
    Category.FOOD_TRUCK, Category.CAKE_VENDOR, Category.PALM_WINE,
    Category.CHAMPAGNE_SERVICE, Category.MOCKTAIL_SPECIALIST
  ],
  "Media & Coverage": [
    Category.PHOTOGRAPHER, Category.VIDEOGRAPHER, Category.DRONE_OPERATOR,
    Category.BOOTH_360, Category.PHOTO_BOOTH, Category.LIVE_STREAMING,
    Category.CONTENT_CREATOR, Category.RED_CARPET_SETUP
  ],
  "Beauty & Personal Prep": [
    Category.MAKEUP_ARTIST, Category.BRIDAL_MAKEUP, Category.HAIRSTYLIST,
    Category.BARBER, Category.GELE_TIER, Category.NAIL_TECH,
    Category.STYLIST, Category.FASHION_RENTAL, Category.WARDROBE_ASSISTANT,
    Category.GROOM_STYLING
  ],
  "Transport & Access": [
    Category.CHAUFFEUR, Category.LUXURY_CAR_RENTAL, Category.PARTY_BUS,
    Category.DISPATCH_RIDER, Category.VALET_SERVICE
  ],
  "Venues & Event Spaces": [
    Category.VENUE, Category.OUTDOOR_SPACE, Category.ROOFTOP_VENUE,
    Category.BEACH_VENUE, Category.PRIVATE_APARTMENT, Category.CONFERENCE_CENTER,
    Category.POPUP_SPACE
  ],
  "Special Services": [
    Category.EVENT_PLANNER, Category.PROPOSAL_PLANNER, Category.SURPRISE_SETUP,
    Category.CLEANUP_CREW, Category.WAITER, Category.TICKETING,
    Category.INSURANCE, Category.STAGE_MANAGER, Category.HOSTESS
  ]
};

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

export interface ServicePackage {
  id: string;
  name: string;
  description?: string;
  inclusions: string[];
  price: number;
  duration?: string;
  isPopular?: boolean;
  isActive: boolean;
}

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
  isPreLaunch?: boolean;
  coins: number;
  hasPurchasedSignUpPack?: boolean;
  preferredLocation?: Location;
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
  panicModeOptIn?: boolean;
  panicModePrice?: number;
  availabilityStatus?: 'AVAILABLE' | 'LIMITED' | 'BOOKED';
  blockedDates?: string[]; // ISO Strings e.g. ["2024-03-01"]
  lastAvailabilityUpdate?: number; // Timestamp for auto-expiry
  // Venue specific
  venueCapacity?: number;
  venueType?: 'Indoor' | 'Outdoor' | 'Both';
  hasParking?: boolean;
  packages?: ServicePackage[];
}

export type Vendor = User;
