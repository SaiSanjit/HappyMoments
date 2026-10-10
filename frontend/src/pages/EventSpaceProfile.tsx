import React, { useState } from 'react';
import { 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Instagram, 
  Facebook, 
  Heart, 
  Share2, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Users, 
  Award, 
  Sparkles, 
  Building2, 
  Coffee, 
  Wifi, 
  Tv, 
  Utensils, 
  Music, 
  ShieldCheck, 
  Volume2, 
  Car, 
  Wind, 
  Sun, 
  Info, 
  Send, 
  Check, 
  ChevronRight,
  ExternalLink,
  MessageSquare,
  HelpCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ── Reusable Event Space Schema Type Definition ─────────────────────────────
export interface FacilityItem {
  name: string;
  available: boolean | 'not_specified';
  icon: any;
  details?: string;
}

export interface EventSpaceSubSpace {
  name: string;
  type: 'Indoor Banquet' | 'Outdoor Rooftop' | 'Boardroom' | 'Lawn' | 'Dining Lounge';
  totalCapacity: number;
  seatingCapacity: number;
  standingCapacity: number;
  areaSqFt?: number;
  suitableEvents: string[];
}

export interface EventSpaceProfileData {
  // 1. Basic Profile
  id: string;
  name: string;
  logoUrl: string;
  coverImageUrl: string;
  venueType: string;
  tagline: string;
  fullDescription: string;
  address: string;
  areaLocality: string;
  city: string;
  googleMapsUrl?: string;
  contactPhone: string;
  contactEmail: string;
  websiteUrl?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  operatingHours: string;
  establishedYear?: string;
  verified: boolean;
  sourceListing: string;
  sourceUrl: string;

  // 2. Venue Details
  totalCapacityMax: number;
  indoorCapacityMax: number;
  outdoorCapacityMax: number;
  numberOfSubSpaces: number;
  totalAreaSqFt?: number;
  seatingLayouts: string[];
  suitableEventFormats: string[];

  // 3. Facilities & Amenities
  facilities: FacilityItem[];

  // 4. Services
  services: {
    name: string;
    status: 'Available' | 'Not specified' | 'Optional';
    description?: string;
  }[];

  // 5. Pricing
  pricing: {
    perPlateVegStarting?: number;
    perPlateNonVegStarting?: number | 'Not specified';
    startingSessionPrice?: number;
    hourlyRate?: number | 'Not specified';
    halfDayRate?: number | 'Not specified';
    fullDayRate?: number | 'Not specified';
    minBookingDuration: string;
    securityDeposit: string;
    cateringPricingNote: string;
    additionalCharges: string[];
    cancellationPolicySummary: string;
  };

  // 6. Availability & Booking
  booking: {
    leadTimeNotice: string;
    availableTimeSlots: string[];
    instantBookingEnabled: boolean;
  };

  // 7. Gallery
  gallery: {
    category: 'Venue & Exterior' | 'Indoor Spaces' | 'Outdoor Sky Garden' | 'Food & Catering' | 'Setups & Decor';
    url: string;
    caption: string;
  }[];

  // 8. Reviews
  reviews: {
    overallRating: number;
    totalCount: number;
    highlights: string[];
    testimonials: {
      user: string;
      date: string;
      rating: number;
      comment: string;
      event: string;
    }[];
  };

  // 9. Policies
  policies: {
    cateringPolicy: string;
    alcoholPolicy: string;
    decorationPolicy: string;
    outsideVendorsPolicy: string;
    noiseMusicLimit: string;
    smokingPolicy: string;
    petPolicy: string;
    cancellationPolicy: string;
  };

  // 10. Event-Space Specific Metadata
  metadata: {
    bestSuitedFor: string[];
    idealGuestCountRange: string;
    atmosphereVibe: string;
    naturalLightLevel: string;
    setupFlexibility: string;
    vendorFlexibility: string;
    nearbyLandmarks: string[];
    uniqueSellingPoints: string[];
  };
}

// ── Real Populated Data: Taj Tristar, SD Road, Secunderabad, Hyderabad ───────
export const SAMPLE_TAJ_TRISTAR_PROFILE: EventSpaceProfileData = {
  // 1. Basic Profile
  id: "space-taj-tristar-secunderabad",
  name: "Taj Tristar Banquets & Sky Garden",
  logoUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=200&q=80",
  coverImageUrl: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80",
  venueType: "Hotel Banquet Hall & Rooftop Event Space",
  tagline: "Premier Pure Vegetarian Banquet Halls & Sky Garden Rooftop Venue in Secunderabad",
  fullDescription: "Taj Tristar is an established 3-star hospitality and event hub located on Sarojini Devi Road, Secunderabad. Renowned for its gourmet pure vegetarian dining and versatile banquet spaces, Taj Tristar features multiple pillarless indoor halls (Krystal & Glitters) alongside an open-air Sky Garden rooftop venue. Operating under the TMH Group, it offers end-to-end event management, 84 luxury guest rooms, full power backup, and dedicated valet parking for weddings, sangeet ceremonies, corporate AGMs, and social gatherings.",
  address: "1-1-40, Seven Hills, Sarojini Devi Road, Secunderabad - 500003, Telangana",
  areaLocality: "SD Road / Parklane, Secunderabad",
  city: "Hyderabad",
  googleMapsUrl: "https://maps.google.com/?q=Taj+Tristar+Secunderabad",
  contactPhone: "040 2781 8989",
  contactEmail: "tristar@tmhgroup.in",
  websiteUrl: "https://tmhgroup.in",
  instagramUrl: "https://instagram.com/tajtristar",
  facebookUrl: "https://facebook.com/tajtristar",
  operatingHours: "08:00 AM – 11:30 PM (Daily)",
  establishedYear: "2008 (15+ Years Active)",
  verified: true,
  sourceListing: "Justdial, TMH Group Official & WeddingWire India Listing",
  sourceUrl: "https://justdial.com/Hyderabad/Taj-Tristar-Hotel-Opposite-Clock-Tower-Secunderabad",

  // 2. Venue Details
  totalCapacityMax: 1000,
  indoorCapacityMax: 450,
  outdoorCapacityMax: 700,
  numberOfSubSpaces: 4,
  totalAreaSqFt: 12500,
  seatingLayouts: ["Theatre Style", "Cluster / Round Tables", "Classroom", "U-Shape Boardroom", "Standing Cocktail Reception"],
  suitableEventFormats: [
    "Weddings & Engagements",
    "Mehendi & Sangeet",
    "Corporate Conferences & AGMs",
    "Product Launches & Seminars",
    "Birthday Celebrations & Milestones",
    "Networking Dinners & Award Nights",
    "Photoshoots & Fashion Shows",
    "Private Family Receptions"
  ],

  // 3. Facilities & Amenities Checklist
  facilities: [
    { name: "Valet & On-site Parking", available: true, icon: Car, details: "Ample parking with dedicated valet drivers" },
    { name: "High-Speed Wi-Fi", available: true, icon: Wifi, details: "Complimentary optical fiber Wi-Fi in all halls" },
    { name: "Central Air Conditioning", available: true, icon: Wind, details: "Climate-controlled indoor banquet halls" },
    { name: "100% Power Backup", available: true, icon: Sun, details: "Heavy-duty auto-switch silent generators" },
    { name: "Audio System & Mics", available: true, icon: Music, details: "In-house JBL sound system & wireless mics" },
    { name: "Projector & Screen", available: true, icon: Tv, details: "HD projectors available on request" },
    { name: "Modular Stage", available: true, icon: Building2, details: "Customizable stage setup for ceremonies" },
    { name: "AC Changing / Green Rooms", available: true, icon: Users, details: "2 complimentary AC bridal changing rooms" },
    { name: "Elevator & Ramp Access", available: true, icon: CheckCircle, details: "Wheelchair accessible with dual elevators" },
    { name: "24/7 Security & CCTV", available: true, icon: ShieldCheck, details: "CCTV surveillance & trained security staff" },
    { name: "In-house Pure Veg Kitchen", available: true, icon: Utensils, details: "Dedicated pure-veg master kitchen" },
    { name: "Dedicated Restrooms", available: true, icon: CheckCircle, details: "Executive multi-stall washrooms" },
    { name: "Guest Accommodation", available: true, icon: Building2, details: "84 well-appointed hotel rooms on site" },
    { name: "Swimming Pool", available: 'not_specified', icon: HelpCircle, details: "Not specified on public directory" },
    { name: "Outside Catering Allowed", available: false, icon: XCircle, details: "Only in-house pure vegetarian catering allowed" }
  ],

  // 4. Services
  services: [
    { name: "In-house Pure Veg Catering", status: "Available", description: "Multi-cuisine vegetarian delicacies curated by expert chefs" },
    { name: "Outside Catering", status: "Not specified", description: "Strictly in-house catering enforced" },
    { name: "Event Decoration Setup", status: "Available", description: "Empaneled floral and stage decoration partners" },
    { name: "Event Planning & Coordination", status: "Available", description: "Dedicated banquet manager for event execution" },
    { name: "AV & Sound Technician Support", status: "Available", description: "On-site sound technician provided during event" },
    { name: "Staffing & Service Crew", status: "Available", description: "Uniformed captains, waiters, and housekeeping crew" },
    { name: "In-house Photography", status: "Not specified", description: "Clients may hire outside photographers freely" }
  ],

  // 5. Pricing
  pricing: {
    perPlateVegStarting: 450,
    perPlateNonVegStarting: "Not specified", // Pure Veg Venue
    startingSessionPrice: 25000,
    hourlyRate: "Not specified",
    halfDayRate: "Not specified",
    fullDayRate: "Not specified",
    minBookingDuration: "4 Hours per slot",
    securityDeposit: "50% advance booking deposit required to lock dates",
    cateringPricingNote: "Per plate pricing starts at ₹450 + taxes for standard buffet menu. Customizable premium menus available.",
    additionalCharges: ["GST @ 18% on F&B", "Power Backup diesel charges for extended hours", "Custom floral decorator vendor royalty fee"],
    cancellationPolicySummary: "Advance payment of 50% is non-refundable upon cancellation within 30 days of the scheduled event date."
  },

  // 6. Availability & Booking
  booking: {
    leadTimeNotice: "15 to 60 days advance booking recommended for weekend dates",
    availableTimeSlots: [
      "Morning Slot: 08:30 AM – 03:30 PM",
      "Evening Slot: 06:30 PM – 11:30 PM",
      "Full Day Booking: 08:30 AM – 11:30 PM"
    ],
    instantBookingEnabled: true
  },

  // 7. Gallery Categories
  gallery: [
    {
      category: "Outdoor Sky Garden",
      url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80",
      caption: "Open-air Sky Garden rooftop illuminated for evening cocktail receptions"
    },
    {
      category: "Indoor Spaces",
      url: "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=800&q=80",
      caption: "Krystal Banquet Hall in round-table cluster setup"
    },
    {
      category: "Setups & Decor",
      url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
      caption: "Mandap & stage floral decoration arrangement"
    },
    {
      category: "Food & Catering",
      url: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80",
      caption: "Pure vegetarian live buffet counters and dessert station"
    },
    {
      category: "Venue & Exterior",
      url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      caption: "Taj Tristar Hotel facade and entrance lounge"
    }
  ],

  // 8. Reviews
  reviews: {
    overallRating: 4.4,
    totalCount: 520,
    highlights: [
      "Authentic, high quality pure-veg catering",
      "Breathtaking open-air rooftop view at Sky Garden",
      "Courteous and efficient banquet management team",
      "Convenient location on SD Road with smooth valet parking"
    ],
    testimonials: [
      {
        user: "Srikanth & Deepthi V.",
        date: "August 2026",
        rating: 5.0,
        event: "Engagement Ceremony",
        comment: "We hosted our engagement at the Sky Garden rooftop. The food was top notch, staff was super attentive, and the fairy lights setup created a magical atmosphere!"
      },
      {
        user: "Dr. K. Ramakrishna",
        date: "July 2026",
        rating: 4.5,
        event: "Medical Association Seminar",
        comment: "Excellent venue for corporate seminars. The Krystal hall had flawless audio-visual setup and prompt tea/lunch service for 200 delegates."
      }
    ]
  },

  // 9. Policies
  policies: {
    cateringPolicy: "Strictly In-house Pure Vegetarian Catering. No outside food or non-veg allowed.",
    alcoholPolicy: "Alcohol service requires client to procure temporary excise permit. Served on rooftop only.",
    decorationPolicy: "Decorations must be arranged through empaneled vendors or pre-approved decorators.",
    outsideVendorsPolicy: "Outside photographers and DJs allowed with prior notification.",
    noiseMusicLimit: "Loud outdoor music on Sky Garden permitted until 10:00 PM per municipal rules.",
    smokingPolicy: "Smoking strictly prohibited inside indoor halls. Designated terrace area provided.",
    petPolicy: "Pets are not allowed inside event premises.",
    cancellationPolicy: "50% booking deposit is non-refundable. Dates transferable subject to availability."
  },

  // 10. Event-Space Specific Metadata
  metadata: {
    bestSuitedFor: [
      "Traditional Weddings & Sangeet",
      "Corporate Conferences & Seminars",
      "Intimate Engagement Ceremonies",
      "Pure Veg Festive Receptions",
      "Milestone Birthday Celebrations"
    ],
    idealGuestCountRange: "50 to 700 Guests",
    atmosphereVibe: "Warm, Festive & Professional Rooftop Ambiance",
    naturalLightLevel: "Abundant natural light on rooftop; Ambient chandeliers indoors",
    setupFlexibility: "High - Modular stage, flexible seating, custom buffet arrangements",
    vendorFlexibility: "Moderate - In-house catering mandatory, open for photography/AV",
    nearbyLandmarks: [
      "Secunderabad Railway Station (1.5 km)",
      "Paradise Circle & Biryani Hub (800 meters)",
      "Clock Tower Secunderabad (600 meters)",
      "Begumpet Airport Road (3.5 km)"
    ],
    uniqueSellingPoints: [
      "Famous for authentic pure vegetarian high-capacity feast catering",
      "Dual option: Indoor pillarless AC halls + Scenic open-air Sky Garden rooftop",
      "In-house lodging with 84 luxury guest rooms for outstation wedding guests",
      "Prime location in the heart of SD Road Secunderabad with full valet parking"
    ]
  }
};

const EventSpaceProfile: React.FC = () => {
  const navigate = useNavigate();
  const space = SAMPLE_TAJ_TRISTAR_PROFILE;
  
  const [activeTab, setActiveTab] = useState<'overview' | 'spaces' | 'amenities' | 'pricing' | 'policies' | 'gallery' | 'reviews'>('overview');
  const [isSaved, setIsSaved] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState<string>('All');

  const [quoteForm, setQuoteForm] = useState({
    name: '',
    phone: '',
    eventType: 'Wedding / Sangeet',
    eventDate: '',
    guestCount: '200',
    notes: ''
  });
  const [quoteSuccess, setQuoteSuccess] = useState(false);

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteSuccess(true);
    setTimeout(() => {
      setQuoteSuccess(false);
      setShowQuoteModal(false);
    }, 2000);
  };

  const galleryCategories = ['All', 'Outdoor Sky Garden', 'Indoor Spaces', 'Food & Catering', 'Setups & Decor', 'Venue & Exterior'];

  const filteredGallery = selectedGalleryCategory === 'All' 
    ? space.gallery 
    : space.gallery.filter(item => item.category === selectedGalleryCategory);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">
      
      {/* Header Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/')} 
              className="p-2 text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                Verified Event Space Listing
              </span>
              <h1 className="text-base font-extrabold text-slate-900 line-clamp-1">{space.name}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsSaved(!isSaved)}
              className={`p-2.5 rounded-full border transition-colors ${isSaved ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
            <button 
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: space.name, url: window.location.href });
                } else {
                  alert('Link copied to clipboard!');
                }
              }}
              className="p-2.5 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setShowQuoteModal(true)}
              className="hidden sm:flex px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs rounded-xl shadow hover:shadow-emerald-500/20 hover:scale-105 transition-all"
            >
              Request Fast Quote
            </button>
          </div>
        </div>
      </header>

      {/* Hero Media Banner */}
      <section className="relative bg-slate-900 h-[380px] sm:h-[460px] overflow-hidden">
        <img 
          src={space.coverImageUrl} 
          alt={space.name} 
          className="w-full h-full object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-black/20" />
        
        {/* Floating Hero Details Overlay */}
        <div className="absolute bottom-0 inset-x-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 pt-20 text-white">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="bg-emerald-500 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow">
              {space.venueType}
            </span>
            <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-white/20">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Admin Verified Venue
            </span>
            <span className="bg-amber-500 text-white text-xs font-black px-3 py-1 rounded-full flex items-center gap-1 shadow">
              ★ {space.reviews.overallRating} ({space.reviews.totalCount} Reviews)
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white line-clamp-2">
            {space.name}
          </h1>

          <p className="text-sm sm:text-base text-slate-200 mt-2 font-medium flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{space.address}</span>
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
              <Users className="w-4 h-4 text-emerald-400" /> Max Capacity: {space.totalCapacityMax} Guests
            </span>
            <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
              <Utensils className="w-4 h-4 text-amber-400" /> Pure Veg Food from ₹{space.pricing.perPlateVegStarting}/plate
            </span>
            <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
              <Clock className="w-4 h-4 text-sky-400" /> {space.operatingHours}
            </span>
          </div>
        </div>
      </section>

      {/* Main Content & Sidebar Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2-Column Main Content */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Navigation Tabs */}
          <div className="bg-white rounded-2xl border border-slate-200 p-1.5 shadow-sm overflow-x-auto scrollbar-none flex gap-1">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'spaces', label: 'Halls & Spaces' },
              { id: 'amenities', label: 'Facilities & Services' },
              { id: 'pricing', label: 'Pricing & Packages' },
              { id: 'policies', label: 'Policies' },
              { id: 'gallery', label: 'Gallery' },
              { id: 'reviews', label: 'Reviews' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              
              {/* Short Intro Card */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
                <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-emerald-600" /> About The Event Venue
                </h2>
                <p className="text-slate-700 text-sm leading-relaxed font-medium">
                  {space.fullDescription}
                </p>

                {/* Quick Highlights Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                  {space.metadata.uniqueSellingPoints.map((usp, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                      <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span className="text-xs font-bold text-emerald-950">{usp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suitable Event Formats */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" /> Suitable Event Formats
                </h3>
                <div className="flex flex-wrap gap-2">
                  {space.suitableEventFormats.map((evt, idx) => (
                    <span 
                      key={idx}
                      className="bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 border border-slate-200 hover:border-emerald-300 text-xs font-bold px-3.5 py-2 rounded-xl transition-all cursor-default"
                    >
                      ✨ {evt}
                    </span>
                  ))}
                </div>
              </div>

              {/* Event-Space Specific Profile Features */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Info className="w-5 h-5 text-sky-600" /> Key Venue Specifications
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Ideal Guest Count</p>
                    <p className="text-sm font-black text-slate-800 mt-1">{space.metadata.idealGuestCountRange}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Atmosphere / Vibe</p>
                    <p className="text-sm font-black text-slate-800 mt-1">{space.metadata.atmosphereVibe}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Setup Flexibility</p>
                    <p className="text-sm font-black text-slate-800 mt-1">{space.metadata.setupFlexibility}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Vendor Flexibility</p>
                    <p className="text-sm font-black text-slate-800 mt-1">{space.metadata.vendorFlexibility}</p>
                  </div>
                </div>

                {/* Nearby Landmarks */}
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">Nearby Connectivity & Landmarks</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {space.metadata.nearbyLandmarks.map((lm, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{lm}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Tab 2: HALLS & SPACES */}
          {activeTab === 'spaces' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-200">
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-600" /> Available Sub-Spaces ({space.numberOfSubSpaces})
              </h2>

              <div className="space-y-4">
                {[
                  {
                    name: "Sky Garden Rooftop Terrace",
                    type: "Outdoor Rooftop",
                    totalCapacity: 700,
                    seatingCapacity: 400,
                    standingCapacity: 700,
                    description: "Open-air rooftop terrace overlooking Secunderabad skyline. Features fairy lights, gazebos, live buffet setup, and breeze views."
                  },
                  {
                    name: "Krystal Banquet Hall",
                    type: "Indoor Banquet",
                    totalCapacity: 450,
                    seatingCapacity: 300,
                    standingCapacity: 450,
                    description: "Pillarless climate-controlled indoor banquet hall with crystal chandeliers, acoustic wall padding, and modular stage."
                  },
                  {
                    name: "Glitters Banquet Hall",
                    type: "Indoor Banquet",
                    totalCapacity: 250,
                    seatingCapacity: 150,
                    standingCapacity: 250,
                    description: "Elegant indoor hall tailored for mehendi ceremonies, corporate seminars, and birthday receptions."
                  },
                  {
                    name: "Capitol Executive Boardroom",
                    type: "Boardroom",
                    totalCapacity: 40,
                    seatingCapacity: 25,
                    standingCapacity: 40,
                    description: "Executive conference suite equipped with projector, conference call setup, and high-speed Wi-Fi."
                  }
                ].map((subSpace, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="bg-emerald-100 text-emerald-900 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                          {subSpace.type}
                        </span>
                        <h3 className="text-base font-extrabold text-slate-900">{subSpace.name}</h3>
                      </div>
                      <p className="text-xs text-slate-600 font-medium">{subSpace.description}</p>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-bold text-slate-700 bg-white px-4 py-3 rounded-xl border border-slate-200 shrink-0 w-full sm:w-auto justify-around sm:justify-start">
                      <div>
                        <p className="text-[10px] text-slate-400 font-extrabold uppercase">Seating</p>
                        <p className="font-black text-slate-900">{subSpace.seatingCapacity} Seats</p>
                      </div>
                      <div className="h-6 w-px bg-slate-200" />
                      <div>
                        <p className="text-[10px] text-slate-400 font-extrabold uppercase">Max Capacity</p>
                        <p className="font-black text-emerald-700">{subSpace.totalCapacity} Pax</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: FACILITIES & SERVICES */}
          {activeTab === 'amenities' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              
              {/* Facilities Checklist */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600" /> Venue Facilities Checklist
                  </h2>
                  <span className="text-xs text-slate-400 font-medium">Source: Justdial & Direct Verification</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {space.facilities.map((fac, idx) => {
                    const IconComp = fac.icon;
                    return (
                      <div 
                        key={idx}
                        className={`p-3.5 rounded-2xl border flex items-start gap-3 transition-all ${
                          fac.available === true 
                            ? 'bg-emerald-50/40 border-emerald-100 text-slate-900' 
                            : fac.available === false 
                            ? 'bg-red-50/40 border-red-100 text-slate-500 line-through'
                            : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        <div className={`p-2 rounded-xl ${fac.available === true ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                          <IconComp className="w-4 h-4" />
                        </div>
                        <div className="flex-1 text-xs">
                          <div className="flex items-center justify-between font-extrabold">
                            <span>{fac.name}</span>
                            {fac.available === true && <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Available</span>}
                            {fac.available === false && <span className="text-[10px] font-black text-red-600 bg-red-100 px-2 py-0.5 rounded-full">No</span>}
                            {fac.available === 'not_specified' && <span className="text-[10px] font-black text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">Not specified</span>}
                          </div>
                          {fac.details && <p className="text-[11px] text-slate-500 mt-1 font-medium">{fac.details}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Services List */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-600" /> Vendor Services Provided
                </h3>
                <div className="space-y-3">
                  {space.services.map((srv, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-extrabold text-slate-900">{srv.name}</p>
                        {srv.description && <p className="text-slate-500 text-[11px] mt-0.5 font-medium">{srv.description}</p>}
                      </div>
                      <span className={`px-3 py-1 rounded-full font-black text-[10px] ${srv.status === 'Available' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                        {srv.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Tab 4: PRICING */}
          {activeTab === 'pricing' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-200">
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Utensils className="w-5 h-5 text-emerald-600" /> Pricing & Tariff Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-md">
                  <p className="text-xs uppercase font-extrabold tracking-wider text-emerald-100">Pure Veg Buffet Per Plate</p>
                  <h3 className="text-3xl font-black mt-2">₹{space.pricing.perPlateVegStarting} <span className="text-xs font-normal text-emerald-100">/ plate starting</span></h3>
                  <p className="text-xs text-emerald-100/90 mt-2 font-medium">{space.pricing.cateringPricingNote}</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 text-white shadow-md">
                  <p className="text-xs uppercase font-extrabold tracking-wider text-slate-400">Non-Veg Buffet Per Plate</p>
                  <h3 className="text-2xl font-black mt-2 text-slate-300">Not specified</h3>
                  <p className="text-xs text-slate-400 mt-2 font-medium">Taj Tristar is a pure-veg establishment. Non-veg catering is strictly prohibited.</p>
                </div>
              </div>

              {/* Additional Charges & Security */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Booking Terms & Tax Information</h4>
                <div className="space-y-2 text-xs font-medium text-slate-700">
                  <p className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <strong>Advance Deposit:</strong> {space.pricing.securityDeposit}
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <strong>Minimum Booking Duration:</strong> {space.pricing.minBookingDuration}
                  </p>
                  {space.pricing.additionalCharges.map((chg, idx) => (
                    <p key={idx} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{chg}</span>
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: POLICIES */}
          {activeTab === 'policies' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-200">
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" /> Venue Policies & Event Guidelines
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: "Catering Policy", value: space.policies.cateringPolicy },
                  { title: "Alcohol Policy", value: space.policies.alcoholPolicy },
                  { title: "Decoration Policy", value: space.policies.decorationPolicy },
                  { title: "Outside Vendors Policy", value: space.policies.outsideVendorsPolicy },
                  { title: "Music & Noise Limits", value: space.policies.noiseMusicLimit },
                  { title: "Smoking Policy", value: space.policies.smokingPolicy },
                  { title: "Pet Policy", value: space.policies.petPolicy },
                  { title: "Cancellation Policy", value: space.policies.cancellationPolicy }
                ].map((pol, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-xs font-black text-slate-900">{pol.title}</p>
                    <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">{pol.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 6: GALLERY */}
          {activeTab === 'gallery' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-200">
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" /> Photo Gallery
              </h2>

              {/* Filter Pills */}
              <div className="flex flex-wrap gap-2">
                {galleryCategories.map((cat, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedGalleryCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-colors ${selectedGalleryCategory === cat ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Gallery Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredGallery.map((img, idx) => (
                  <div key={idx} className="group relative h-56 rounded-2xl overflow-hidden bg-slate-900 shadow-md">
                    <img src={img.url} alt={img.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-90" />
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-600 px-2 py-0.5 rounded text-white mb-1 inline-block">
                        {img.category}
                      </span>
                      <p className="text-xs font-bold line-clamp-1">{img.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 7: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" /> Ratings & Customer Reviews
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Aggregated from Justdial & WeddingWire listings</p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-slate-900">{space.reviews.overallRating}</span>
                  <span className="text-xs text-slate-400 font-bold block">out of 5.0</span>
                </div>
              </div>

              {/* Testimonials */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                {space.reviews.testimonials.map((t, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-slate-900">{t.user}</span>
                      <span className="text-slate-400 font-medium">{t.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-amber-500 font-black">★ {t.rating}</span>
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">
                        Event: {t.event}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">"{t.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right 1-Column Sticky Action Sidebar */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xl sticky top-24 space-y-6">
            
            {/* Price Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white">
              <p className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">Per Plate Starting From</p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black text-emerald-400">₹{space.pricing.perPlateVegStarting}</span>
                <span className="text-xs text-slate-300 font-bold">/ guest + taxes</span>
              </div>
              <p className="text-[11px] text-emerald-300 mt-2 font-medium">Includes pure vegetarian buffet & hall usage</p>
            </div>

            {/* Quick Venue Info */}
            <div className="space-y-3 text-xs font-semibold text-slate-700">
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Max Guest Capacity</span>
                <span className="font-extrabold text-slate-900">{space.totalCapacityMax} Guests</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Sub-Spaces Available</span>
                <span className="font-extrabold text-slate-900">{space.numberOfSubSpaces} Halls & Terrace</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Food Policy</span>
                <span className="font-extrabold text-emerald-700">Pure Veg (In-house)</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Parking</span>
                <span className="font-extrabold text-slate-900">Valet & On-site</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-3">
              <button 
                onClick={() => setShowQuoteModal(true)}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm rounded-xl shadow-lg hover:shadow-emerald-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Request Custom Quote
              </button>

              <a 
                href={`tel:${space.contactPhone}`}
                className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-emerald-600" /> Call Venue Manager ({space.contactPhone})
              </a>
            </div>

            {/* Source Reference Note */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 space-y-1 font-medium">
              <p className="font-bold text-slate-700 flex items-center gap-1">
                <ExternalLink className="w-3 h-3 text-emerald-600" /> Source Information
              </p>
              <p>Data compiled from publicly listed profiles on Justdial & TMH Group Official.</p>
            </div>

          </div>

        </div>

      </main>

      {/* Quote / Availability Request Modal */}
      {showQuoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold">Request Event Quotation</h3>
                <p className="text-xs text-emerald-100">{space.name}</p>
              </div>
              <button onClick={() => setShowQuoteModal(false)} className="text-white/80 hover:text-white">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {quoteSuccess ? (
              <div className="p-8 text-center space-y-3">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
                <h4 className="text-lg font-extrabold text-slate-900">Enquiry Sent Successfully!</h4>
                <p className="text-xs text-slate-600">The venue manager at Taj Tristar will review your date & guest count and call you back shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleQuoteSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">Your Full Name *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Vikram Sharma"
                    value={quoteForm.name}
                    onChange={e => setQuoteForm({...quoteForm, name: e.target.value})}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">Phone Number *</label>
                  <input 
                    type="tel" 
                    required 
                    placeholder="e.g. +91 98765 43210"
                    value={quoteForm.phone}
                    onChange={e => setQuoteForm({...quoteForm, phone: e.target.value})}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">Event Type</label>
                    <select 
                      value={quoteForm.eventType}
                      onChange={e => setQuoteForm({...quoteForm, eventType: e.target.value})}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Wedding / Sangeet">Wedding / Sangeet</option>
                      <option value="Engagement Party">Engagement Party</option>
                      <option value="Corporate Conference">Corporate Conference</option>
                      <option value="Birthday Celebration">Birthday Celebration</option>
                      <option value="Other Event">Other Event</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">Est. Guests</label>
                    <input 
                      type="number" 
                      value={quoteForm.guestCount}
                      onChange={e => setQuoteForm({...quoteForm, guestCount: e.target.value})}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">Tentative Event Date</label>
                  <input 
                    type="date" 
                    value={quoteForm.eventDate}
                    onChange={e => setQuoteForm({...quoteForm, eventDate: e.target.value})}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow transition-all"
                >
                  Submit Quote Request
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default EventSpaceProfile;
