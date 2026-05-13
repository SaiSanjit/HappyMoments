export interface TrustStat {
  label: string;
  value: string;
  detail: string;
}

export interface CategorySpotlight {
  name: string;
  description: string;
  image: string;
  vendorCount: string;
  averageStartingPrice: string;
}

export interface FeaturedVendor {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  priceFrom: number;
  location: string;
  image: string;
  verified: boolean;
  availability: string;
  replyTime: string;
  topTag: string;
}

export interface InspirationItem {
  title: string;
  subtitle: string;
  image: string;
  span: string;
}

export interface PlatformBenefit {
  title: string;
  description: string;
}

export const TRUST_STATS: TrustStat[] = [
  {
    label: "Verified vendors",
    value: "4,800+",
    detail: "Every profile is reviewed for portfolio quality, response consistency, and service legitimacy.",
  },
  {
    label: "Successful bookings",
    value: "32,000+",
    detail: "From intimate family celebrations to multi-day weddings and enterprise-scale events.",
  },
  {
    label: "Happy customers",
    value: "96%",
    detail: "Clients return for anniversaries, birthdays, baby showers, and repeat corporate experiences.",
  },
  {
    label: "Trusted cities",
    value: "28",
    detail: "Strong vendor density across Hyderabad, Bangalore, Mumbai, Delhi NCR, Chennai, and Jaipur.",
  },
];

export const TRUST_MARKS = [
  "Planner Circle",
  "Venue Collective",
  "Host Society",
  "Lumiere Events",
  "Celebration Guild",
];

export const CATEGORY_SPOTLIGHTS: CategorySpotlight[] = [
  {
    name: "Photography",
    description: "Editorial storytelling teams for weddings, engagements, baby showers, and milestone celebrations.",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=80",
    vendorCount: "740 studios",
    averageStartingPrice: "From INR 55K",
  },
  {
    name: "Venues",
    description: "Luxury hotels, intimate lawns, rooftop spaces, beachfront properties, and destination-ready venues.",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80",
    vendorCount: "420 venues",
    averageStartingPrice: "From INR 1.8L",
  },
  {
    name: "Catering",
    description: "Chef-led menus, live counters, regional feasts, tasting sessions, and premium guest experiences.",
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=1200&q=80",
    vendorCount: "510 caterers",
    averageStartingPrice: "From INR 1,450/guest",
  },
  {
    name: "Decorators",
    description: "Floral styling, mandap concepts, immersive themes, luxury tablescapes, and ceremony staging.",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80",
    vendorCount: "360 ateliers",
    averageStartingPrice: "From INR 90K",
  },
  {
    name: "Makeup",
    description: "Bridal beauty experts, trial-led bookings, skin-focused artistry, and all-day event-ready glam.",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&q=80",
    vendorCount: "285 artists",
    averageStartingPrice: "From INR 28K",
  },
  {
    name: "Event Planners",
    description: "End-to-end planning teams for guest management, timeline control, sourcing, and execution.",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=80",
    vendorCount: "190 planners",
    averageStartingPrice: "From INR 1.2L",
  },
];

export const FEATURED_VENDORS: FeaturedVendor[] = [
  {
    id: "atelier-frame",
    name: "Atelier Frame Collective",
    category: "Photography",
    rating: 4.9,
    reviews: 184,
    priceFrom: 95000,
    location: "Hyderabad",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80",
    verified: true,
    availability: "Available for November",
    replyTime: "Replies in 18 min",
    topTag: "Editorial luxury weddings",
  },
  {
    id: "opal-gardens",
    name: "Opal Gardens Estate",
    category: "Venues",
    rating: 4.8,
    reviews: 267,
    priceFrom: 225000,
    location: "Bangalore",
    image: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1200&q=80",
    verified: true,
    availability: "2 prime weekends left",
    replyTime: "Virtual tour in 1 hour",
    topTag: "Garden + ballroom destination feel",
  },
  {
    id: "saffron-feast",
    name: "Saffron Feast Atelier",
    category: "Catering",
    rating: 4.9,
    reviews: 129,
    priceFrom: 1850,
    location: "Mumbai",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80",
    verified: true,
    availability: "Tasting slots this week",
    replyTime: "Menu draft in 35 min",
    topTag: "Signature plated + live experiences",
  },
  {
    id: "velvet-bloom",
    name: "Velvet Bloom Studio",
    category: "Decorators",
    rating: 4.7,
    reviews: 91,
    priceFrom: 135000,
    location: "Delhi NCR",
    image: "https://images.unsplash.com/photo-1513278974582-3e1b4a4fa21d?w=1200&q=80",
    verified: true,
    availability: "Fast-track proposals open",
    replyTime: "Moodboard in 45 min",
    topTag: "Floral storytelling + immersive styling",
  },
  {
    id: "aurelia-plans",
    name: "Aurelia Event House",
    category: "Event Planners",
    rating: 5,
    reviews: 76,
    priceFrom: 180000,
    location: "Jaipur",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&q=80",
    verified: true,
    availability: "Destination planning open",
    replyTime: "Planning consult in 20 min",
    topTag: "Guest experience and timeline control",
  },
  {
    id: "halo-beauty",
    name: "Halo Bridal Atelier",
    category: "Makeup",
    rating: 4.8,
    reviews: 142,
    priceFrom: 42000,
    location: "Chennai",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=1200&q=80",
    verified: true,
    availability: "Trials available this month",
    replyTime: "Lookbook in 12 min",
    topTag: "Soft-glam bridal artistry",
  },
];

export const INSPIRATION_ITEMS: InspirationItem[] = [
  {
    title: "Moonlit Mandap",
    subtitle: "Layered florals, ambient lighting, and cinematic ceremony staging.",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=80",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    title: "Editorial Couple Frames",
    subtitle: "Luxury portrait references with warm tones and natural movement.",
    image: "https://images.unsplash.com/photo-1529636798458-92182e662485?w=1200&q=80",
    span: "md:col-span-1 md:row-span-1",
  },
  {
    title: "Reception Tablescape",
    subtitle: "Refined hosting details for premium dinner experiences.",
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80",
    span: "md:col-span-1 md:row-span-1",
  },
  {
    title: "Grand Arrival",
    subtitle: "Venue entrances, procession styling, and guest-first reveal moments.",
    image: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=1200&q=80",
    span: "md:col-span-1 md:row-span-2",
  },
  {
    title: "Intimate Celebration Corners",
    subtitle: "Small-format lounges, engagement brunches, and luxe private-party settings.",
    image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1200&q=80",
    span: "md:col-span-2 md:row-span-1",
  },
];

export const PLATFORM_BENEFITS: PlatformBenefit[] = [
  {
    title: "Verified Vendors",
    description: "Every listing is vetted for portfolio quality, category fit, business legitimacy, and reliability.",
  },
  {
    title: "Secure Booking",
    description: "Architecture is ready for protected payments, milestone-based approvals, and booking visibility.",
  },
  {
    title: "Real Reviews",
    description: "Decision-making is anchored by trusted feedback, verified event histories, and proof-rich profiles.",
  },
  {
    title: "Instant Chat",
    description: "Move from discovery to conversation in minutes with guided messaging, quote sharing, and follow-ups.",
  },
  {
    title: "Smart Recommendations",
    description: "Concierge-style suggestions help users shortlist the right vendors based on event type and budget.",
  },
  {
    title: "Premium Experience",
    description: "Luxury visual design and clear information architecture make high-value planning feel effortless.",
  },
];

export const FOOTER_LINK_GROUPS = [
  {
    title: "Company",
    links: ["About", "Careers", "Press", "Contact"],
  },
  {
    title: "Vendors",
    links: ["Become a Vendor", "Vendor Dashboard", "Verification", "Subscriptions"],
  },
  {
    title: "Support",
    links: ["Help Center", "Safety", "Booking Policy", "Community"],
  },
  {
    title: "Legal",
    links: ["Privacy", "Terms", "Escrow Policy", "Cookie Settings"],
  },
];
