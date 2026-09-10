export interface BusinessSpace {
  id: string;
  title: string;
  category: 'product_launch' | 'college_space';
  categoryLabel: string;
  section: 'featured_launch' | 'college_space';
  tagline: string;
  city: string;
  locality: string;
  address: string;
  pricing: {
    amount: number;
    unit: string;
    displayPrice: string;
  };
  discountOffer?: string;
  discountPercent?: number;
  bookingManagedBy?: string;
  dimensions: string;
  capacity: string;
  capacityDetails: {
    minGuests: number;
    maxGuests: number;
    seatingCapacity: number;
    standingCapacity: number;
  };
  spaceDetails: {
    totalArea: string;
    stage: string;
    parking: string;
  };
  images: string[];
  catalogImages?: string[];
  features: string[];
  idealFor: string[];
  amenities: {
    name: string;
    icon: string;
  }[];
  availability: string;
  managerContact: {
    name: string;
    phone: string;
    whatsapp: string;
    email: string;
  };
  rating: number;
  reviewsCount: number;
  availableFrom: string;
  featured?: boolean;
}

export const HAPPYMOMENTS_SUPPORT_PHONE = '7330732710';
export const HAPPYMOMENTS_WHATSAPP_NUMBER = '+91 7330732710';
export const HAPPYMOMENTS_WHATSAPP_LINK = 'https://wa.me/917330732710';

export const BUSINESS_SPACES: BusinessSpace[] = [
  // =========================================================================
  // PRIORITY BUDGET-FRIENDLY SPACES (₹10,000 – ₹40,000) AT THE TOP
  // =========================================================================

  // 1. Pragnya Degree & PG College - ₹18,000 (Real Justdial Photos)
  {
    id: 'venue-pragnya-degree-college',
    title: 'Pragnya Degree & PG College',
    category: 'college_space',
    categoryLabel: 'College Event Space',
    section: 'college_space',
    tagline: 'Cost-Effective Seminar & Demo Hall for Training, Workshops & Demos',
    city: 'Hyderabad',
    locality: 'Chandanagar',
    address: 'Pragnya Campus, Near Chandanagar Railway Station, Chandanagar, Hyderabad, Telangana 500050',
    pricing: {
      amount: 18000,
      unit: 'starting price',
      displayPrice: 'Starting from ₹18,000'
    },
    discountOffer: 'Book via HappyMoments & get 5% more discount',
    discountPercent: 5,
    bookingManagedBy: 'Booking Managed by HappyMoments',
    dimensions: '5,500 sq.ft.',
    capacity: 'Up to 450 Guests',
    capacityDetails: {
      minGuests: 80,
      maxGuests: 450,
      seatingCapacity: 350,
      standingCapacity: 450
    },
    spaceDetails: {
      totalArea: '5,500 sq.ft.',
      stage: 'Raised Seminar Stage with Audio Rack',
      parking: 'College Parking Lot for 200 Two/Four Wheelers'
    },
    images: [
      "https://content.jdmagicbox.com/v2/comp/hyderabad/p2/040pxx40.xx40.110103134309.r3p2/catalogue/pragnya-degree-and-pg-college-chanda-nagar-hyderabad-degree-colleges-jltiemspi6.jpg",
      "https://content.jdmagicbox.com/v2/comp/hyderabad/p2/040pxx40.xx40.110103134309.r3p2/catalogue/pragnya-degree-and-pg-college-chanda-nagar-hyderabad-degree-colleges-65a311xpdy.jpg",
      "https://content.jdmagicbox.com/v2/comp/hyderabad/p2/040pxx40.xx40.110103134309.r3p2/catalogue/pragnya-degree-and-pg-college-chanda-nagar-hyderabad-degree-colleges-ymwvp8fajl.jpg",
      "https://content.jdmagicbox.com/v2/comp/hyderabad/p2/040pxx40.xx40.110103134309.r3p2/catalogue/pragnya-degree-and-pg-college-chanda-nagar-hyderabad-degree-colleges-666zmde09p.jpg",
      "https://content.jdmagicbox.com/v2/comp/hyderabad/p2/040pxx40.xx40.110103134309.r3p2/catalogue/pragnya-degree-and-pg-college-chanda-nagar-hyderabad-degree-colleges-wlwbt3cgzp.jpg",
      "https://content.jdmagicbox.com/v2/comp/hyderabad/p2/040pxx40.xx40.110103134309.r3p2/catalogue/pragnya-degree-and-pg-college-chanda-nagar-hyderabad-degree-colleges-n2ny2cc6kg.jpg"
],
    catalogImages: [
      "https://content.jdmagicbox.com/v2/comp/hyderabad/p2/040pxx40.xx40.110103134309.r3p2/catalogue/pragnya-degree-and-pg-college-chanda-nagar-hyderabad-degree-colleges-jltiemspi6.jpg",
      "https://content.jdmagicbox.com/v2/comp/hyderabad/p2/040pxx40.xx40.110103134309.r3p2/catalogue/pragnya-degree-and-pg-college-chanda-nagar-hyderabad-degree-colleges-65a311xpdy.jpg",
      "https://content.jdmagicbox.com/v2/comp/hyderabad/p2/040pxx40.xx40.110103134309.r3p2/catalogue/pragnya-degree-and-pg-college-chanda-nagar-hyderabad-degree-colleges-ymwvp8fajl.jpg",
      "https://content.jdmagicbox.com/v2/comp/hyderabad/p2/040pxx40.xx40.110103134309.r3p2/catalogue/pragnya-degree-and-pg-college-chanda-nagar-hyderabad-degree-colleges-666zmde09p.jpg",
      "https://content.jdmagicbox.com/v2/comp/hyderabad/p2/040pxx40.xx40.110103134309.r3p2/catalogue/pragnya-degree-and-pg-college-chanda-nagar-hyderabad-degree-colleges-wlwbt3cgzp.jpg",
      "https://content.jdmagicbox.com/v2/comp/hyderabad/p2/040pxx40.xx40.110103134309.r3p2/catalogue/pragnya-degree-and-pg-college-chanda-nagar-hyderabad-degree-colleges-n2ny2cc6kg.jpg"
],
    features: [
      'Clean Seminar Layout with Flexible Seating',
      'PA System with Cordless Microphones',
      'Overhead HD Projection Screen',
      'Cafeteria Access for Catering Needs'
    ],
    idealFor: [
      'Product Demonstrations',
      'Workshops',
      'Startup Events'
    ],
    amenities: [
      { name: 'Projector / LED Screen', icon: 'Tv' },
      { name: 'Sound System', icon: 'Volume2' },
      { name: 'WiFi', icon: 'Wifi' },
      { name: 'Stage', icon: 'Mic' },
      { name: 'AC', icon: 'Wind' },
      { name: 'Parking', icon: 'Car' },
      { name: 'Food / Catering', icon: 'Utensils' },
      { name: 'Power Backup', icon: 'Zap' },
      { name: 'Green Room', icon: 'DoorClosed' },
      { name: 'Photography Area', icon: 'Camera' }
    ],
    availability: '🟢 Available for Inquiry',
    managerContact: {
      name: 'Booking Managed by HappyMoments',
      phone: '7330732710',
      whatsapp: '7330732710',
      email: 'business@happymomentsindia.com'
    },
    rating: 4.5,
    reviewsCount: 16,
    availableFrom: 'Immediate Booking',
    featured: false
  },

  // 2. Avinash College of Commerce - ₹20,000 (Real Kukatpally Campus Photos)
  {
    id: 'venue-avinash-college',
    title: 'Avinash College of Commerce',
    category: 'college_space',
    categoryLabel: 'College Event Space',
    section: 'college_space',
    tagline: 'Centrally Located Multi-Purpose Hall in Heart of KPHB Commercial Hub',
    city: 'Hyderabad',
    locality: 'KPHB',
    address: 'Avinash College Campus, Phase 1, KPHB Colony, Kukatpally, Hyderabad, Telangana 500072',
    pricing: {
      amount: 20000,
      unit: 'starting price',
      displayPrice: 'Starting from ₹20,000'
    },
    discountOffer: 'Book via HappyMoments & get 5% more discount',
    discountPercent: 5,
    bookingManagedBy: 'Booking Managed by HappyMoments',
    dimensions: '4,800 sq.ft.',
    capacity: 'Up to 400 Guests',
    capacityDetails: {
      minGuests: 50,
      maxGuests: 400,
      seatingCapacity: 300,
      standingCapacity: 400
    },
    spaceDetails: {
      totalArea: '4,800 sq.ft.',
      stage: 'Equipped Conference & Seminar Platform',
      parking: 'Campus Basement Parking'
    },
    images: [
      "https://image-static.collegedunia.com/public/college_data/images/campusimage/1680352818Screenshot%202023-04-01%20153908.jpg",
      "https://www.collegebatch.com/static/clg-gallery/avinash-college-of-commerce-kukatpally-hyderabad-298693.jpg",
      "https://media.collegedekho.com/media/img/institute/new-resized-banner/image_Sm5nWuM.jpg?width=1080",
      "https://www.collegebatch.com/static/clg-gallery/avinash-college-of-commerce-kukatpally-hyderabad-298700.webp",
      "https://www.collegebatch.com/static/clg-gallery/avinash-college-of-commerce-kukatpally-hyderabad-298704.jpg",
      "https://media.getmyuni.com/azure/college-image/big/av-college-of-arts-science-and-commerce-hyderabad.jpg"
],
    catalogImages: [
      "https://image-static.collegedunia.com/public/college_data/images/campusimage/1680352818Screenshot%202023-04-01%20153908.jpg",
      "https://www.collegebatch.com/static/clg-gallery/avinash-college-of-commerce-kukatpally-hyderabad-298693.jpg",
      "https://media.collegedekho.com/media/img/institute/new-resized-banner/image_Sm5nWuM.jpg?width=1080",
      "https://www.collegebatch.com/static/clg-gallery/avinash-college-of-commerce-kukatpally-hyderabad-298700.webp",
      "https://www.collegebatch.com/static/clg-gallery/avinash-college-of-commerce-kukatpally-hyderabad-298704.jpg",
      "https://media.getmyuni.com/azure/college-image/big/av-college-of-arts-science-and-commerce-hyderabad.jpg"
],
    features: [
      'Strategic KPHB Location near Metro Station',
      'Full Central AC & Acoustic Sound Panels',
      'HD Projector & Wireless Sound Rig',
      'Flexible Seating for Workshops or Seminars'
    ],
    idealFor: [
      'Business Events',
      'Startup Launches',
      'Workshops',
      'Student Events'
    ],
    amenities: [
      { name: 'Projector / LED Screen', icon: 'Tv' },
      { name: 'Sound System', icon: 'Volume2' },
      { name: 'WiFi', icon: 'Wifi' },
      { name: 'Stage', icon: 'Mic' },
      { name: 'AC', icon: 'Wind' },
      { name: 'Parking', icon: 'Car' },
      { name: 'Food / Catering', icon: 'Utensils' },
      { name: 'Power Backup', icon: 'Zap' },
      { name: 'Green Room', icon: 'DoorClosed' },
      { name: 'Photography Area', icon: 'Camera' }
    ],
    availability: '🟢 Available This Weekend',
    managerContact: {
      name: 'Booking Managed by HappyMoments',
      phone: '7330732710',
      whatsapp: '7330732710',
      email: 'business@happymomentsindia.com'
    },
    rating: 4.6,
    reviewsCount: 18,
    availableFrom: 'Immediate Booking',
    featured: false
  },

  // 3. KLH Global Business School - ₹25,000 (Real Kothaguda Campus Photos)
  {
    id: 'venue-klh-global-business-school',
    title: 'KLH Global Business School',
    category: 'college_space',
    categoryLabel: 'College Auditorium / Business Events',
    section: 'college_space',
    tagline: 'Modern Academic Auditorium with Tiered Seating & Full Conference AV',
    city: 'Hyderabad',
    locality: 'Kothaguda',
    address: 'KLH Global Business School Campus, Botanical Garden Rd, Kothaguda, Hyderabad, Telangana 500084',
    pricing: {
      amount: 25000,
      unit: 'starting price',
      displayPrice: 'Starting from ₹25,000'
    },
    discountOffer: 'Book via HappyMoments & get 5% more discount',
    discountPercent: 5,
    bookingManagedBy: 'Booking Managed by HappyMoments',
    dimensions: '8,000 sq.ft.',
    capacity: 'Up to 600 Guests',
    capacityDetails: {
      minGuests: 100,
      maxGuests: 600,
      seatingCapacity: 500,
      standingCapacity: 600
    },
    spaceDetails: {
      totalArea: '8,000 sq.ft.',
      stage: 'Standard Academic Presentation Stage',
      parking: 'On-Campus Dedicated Parking for 150 Vehicles'
    },
    images: [
      "https://gbs.klh.edu.in/assets/img/side-images/About-us.jpg",
      "https://klh.edu.in/wp-content/uploads/2022/06/KLH-GBS-image.jpeg",
      "https://timess3spore.s3.amazonaws.com/ndata/media/Counsellor/CollegeImage/2023/04/03/1680510093.jpg",
      "https://www.bbacollegesindia.in/wp-content/uploads/2022/06/Global-Business-School-300x269.jpg",
      "https://gbs.klh.edu.in/assets/img/newsletter-thumbnails/february-2023.png",
      "https://gbs.klh.edu.in/assets/img/newsletter-thumbnails/january-2022-issue-12.png"
],
    catalogImages: [
      "https://gbs.klh.edu.in/assets/img/side-images/About-us.jpg",
      "https://klh.edu.in/wp-content/uploads/2022/06/KLH-GBS-image.jpeg",
      "https://timess3spore.s3.amazonaws.com/ndata/media/Counsellor/CollegeImage/2023/04/03/1680510093.jpg",
      "https://www.bbacollegesindia.in/wp-content/uploads/2022/06/Global-Business-School-300x269.jpg",
      "https://gbs.klh.edu.in/assets/img/newsletter-thumbnails/february-2023.png",
      "https://gbs.klh.edu.in/assets/img/newsletter-thumbnails/january-2022-issue-12.png"
],
    features: [
      'Tiered Auditorium Seating with Push-back Chairs',
      'Dual HD Projection & Stage Lighting Rig',
      'VIP Green Room & Executive Guest Lounge',
      'Air-Conditioned with 100% Generator Backup'
    ],
    idealFor: [
      'Corporate Summits',
      'Startup Competitions',
      'Tech Conclaves',
      'Student Hackathons'
    ],
    amenities: [
      { name: 'Projector / LED Screen', icon: 'Tv' },
      { name: 'Sound System', icon: 'Volume2' },
      { name: 'WiFi', icon: 'Wifi' },
      { name: 'Stage', icon: 'Mic' },
      { name: 'AC', icon: 'Wind' },
      { name: 'Parking', icon: 'Car' },
      { name: 'Food / Catering', icon: 'Utensils' },
      { name: 'Power Backup', icon: 'Zap' },
      { name: 'Green Room', icon: 'DoorClosed' },
      { name: 'Photography Area', icon: 'Camera' }
    ],
    availability: '🟢 Booking Open for Next Week',
    managerContact: {
      name: 'Booking Managed by HappyMoments',
      phone: '7330732710',
      whatsapp: '7330732710',
      email: 'business@happymomentsindia.com'
    },
    rating: 4.7,
    reviewsCount: 22,
    availableFrom: 'Immediate Booking',
    featured: false
  },

  // 4. Couch Potato Lounges & Events - ₹35,000 (Real Madhapur Lounge Photos)
  {
    id: 'venue-couch-potato-lounges',
    title: 'Couch Potato Lounges & Events',
    category: 'college_space',
    categoryLabel: 'Boutique Space / Demo Lounge',
    section: 'college_space',
    tagline: 'Trendy Creator Lounge & Demo Space for Influencer Meets, Pop-ups & D2C Launches',
    city: 'Hyderabad',
    locality: 'Madhapur',
    address: 'Couch Potato Space, VIP Hills, Silicon Valley, Madhapur, Hyderabad, Telangana 500081',
    pricing: {
      amount: 35000,
      unit: 'starting price',
      displayPrice: 'Starting from ₹35,000'
    },
    discountOffer: 'Book via HappyMoments & get 5% more discount',
    discountPercent: 5,
    bookingManagedBy: 'Booking Managed by HappyMoments',
    dimensions: '3,200 sq.ft.',
    capacity: 'Up to 250 Guests',
    capacityDetails: {
      minGuests: 30,
      maxGuests: 250,
      seatingCapacity: 150,
      standingCapacity: 250
    },
    spaceDetails: {
      totalArea: '3,200 sq.ft.',
      stage: 'Acoustic Creator Pod & Mic Zone',
      parking: 'Valet & Covered Basement Parking'
    },
    images: [
      "https://threebestrated.in/images/CouchPotatoProductions-Hyderabad-TS-1.jpeg",
      "https://theeverydaybloom.com/wp-content/uploads/2026/03/Couch-potato-party.jpeg",
      "https://cdn5.slideserve.com/11117557/ad-film-makers-in-hyderabad-couch-potato-n.jpg",
      "https://www.evite.com/cms_proxy/61d11361f2619188818de7ca/664ba981b8fa21aa4c6e52ad_Couch%20Potato%20Blog-p-1080.png",
      "https://cdn0.weddingwire.in/vendor/5054/3_2/1280/jpg/partyplace-smaaash-hyderabad-eventspace-1_15_425054-167403088617193.jpeg",
      "https://i.redd.it/va2wei1v011d1.jpeg"
],
    catalogImages: [
      "https://threebestrated.in/images/CouchPotatoProductions-Hyderabad-TS-1.jpeg",
      "https://theeverydaybloom.com/wp-content/uploads/2026/03/Couch-potato-party.jpeg",
      "https://cdn5.slideserve.com/11117557/ad-film-makers-in-hyderabad-couch-potato-n.jpg",
      "https://www.evite.com/cms_proxy/61d11361f2619188818de7ca/664ba981b8fa21aa4c6e52ad_Couch%20Potato%20Blog-p-1080.png",
      "https://cdn0.weddingwire.in/vendor/5054/3_2/1280/jpg/partyplace-smaaash-hyderabad-eventspace-1_15_425054-167403088617193.jpeg",
      "https://i.redd.it/va2wei1v011d1.jpeg"
],
    features: [
      'Aesthetic Ambient Lighting & Creator Studio Backdrops',
      'In-House Hi-Fi Sound & Dynamic RGB Mood Strips',
      'Lounge Sofa Seating & Casual High-Table Zones',
      'Live Streaming & Podcast Recording Support'
    ],
    idealFor: [
      'Brand Activations',
      'Product Demos',
      'Influencer Meets',
      'D2C Pop-Ups'
    ],
    amenities: [
      { name: 'Projector / LED Screen', icon: 'Tv' },
      { name: 'Sound System', icon: 'Volume2' },
      { name: 'WiFi', icon: 'Wifi' },
      { name: 'Stage', icon: 'Mic' },
      { name: 'AC', icon: 'Wind' },
      { name: 'Parking', icon: 'Car' },
      { name: 'Food / Catering', icon: 'Utensils' },
      { name: 'Power Backup', icon: 'Zap' },
      { name: 'Green Room', icon: 'DoorClosed' },
      { name: 'Photography Area', icon: 'Camera' }
    ],
    availability: '🟢 Fast Confirmation Available',
    managerContact: {
      name: 'Booking Managed by HappyMoments',
      phone: '7330732710',
      whatsapp: '7330732710',
      email: 'business@happymomentsindia.com'
    },
    rating: 4.8,
    reviewsCount: 34,
    availableFrom: 'Immediate Booking',
    featured: false
  },

  // 5. Chaitanya Bharathi Institute of Technology (CBIT) - ₹40,000 (Real Gandipet Auditorium Photos)
  {
    id: 'venue-cbit-auditorium',
    title: 'Chaitanya Bharathi Institute of Technology (CBIT)',
    category: 'college_space',
    categoryLabel: 'College Auditorium / Mega Hall',
    section: 'college_space',
    tagline: 'Iconic Grand Institutional Auditorium for University Summits, Conferences & Hackathons',
    city: 'Hyderabad',
    locality: 'Kokapet / Gandipet',
    address: 'CBIT Campus, Gandipet Main Road, Kokapet, Hyderabad, Telangana 500075',
    pricing: {
      amount: 40000,
      unit: 'starting price',
      displayPrice: 'Starting from ₹40,000'
    },
    discountOffer: 'Book via HappyMoments & get 5% more discount',
    discountPercent: 5,
    bookingManagedBy: 'Booking Managed by HappyMoments',
    dimensions: '12,000 sq.ft.',
    capacity: 'Up to 1,200 Guests',
    capacityDetails: {
      minGuests: 150,
      maxGuests: 1200,
      seatingCapacity: 950,
      standingCapacity: 1200
    },
    spaceDetails: {
      totalArea: '12,000 sq.ft.',
      stage: 'Large Proscenium Stage (40ft x 25ft)',
      parking: 'Spacious Campus Ground Parking for 500+ Vehicles'
    },
    images: [
      "https://www.cbit.ac.in/wp-content/uploads/2021/07/2-1024x378.jpeg",
      "https://www.cbit.ac.in/wp-content/uploads/2019/01/CBIT.jpg",
      "https://img.jagranjosh.com/images/2022/December/7122022/Chaitanya-Bharathi-Institute-of-Technology-Hyderabad-Campus-View-3.jpg",
      "https://www.cbit.ac.in/wp-content/uploads/2019/03/Office-tab-scaled.jpeg",
      "https://www.collegebatch.com/static/clg-gallery/chaitanya-bharathi-institute-of-technology-hyderabad-224590.jpg",
      "https://images.careers360.mobi/media/facilities/attac-cbit-hyderabad-auditorium.jpg"
],
    catalogImages: [
      "https://www.cbit.ac.in/wp-content/uploads/2021/07/2-1024x378.jpeg",
      "https://www.cbit.ac.in/wp-content/uploads/2019/01/CBIT.jpg",
      "https://img.jagranjosh.com/images/2022/December/7122022/Chaitanya-Bharathi-Institute-of-Technology-Hyderabad-Campus-View-3.jpg",
      "https://www.cbit.ac.in/wp-content/uploads/2019/03/Office-tab-scaled.jpeg",
      "https://www.collegebatch.com/static/clg-gallery/chaitanya-bharathi-institute-of-technology-hyderabad-224590.jpg",
      "https://images.careers360.mobi/media/facilities/attac-cbit-hyderabad-auditorium.jpg"
],
    features: [
      'Acoustically Engineered Main Auditorium with Balcony',
      'Professional Audio Rig with Mixing Console',
      'Full Stage Spotlight & Motorized Screen',
      'Massive Student Footfall Potential for Youth Brand Campaigns'
    ],
    idealFor: [
      'National Hackathons',
      'Corporate Summits',
      'Product Launches',
      'Annual Conferences'
    ],
    amenities: [
      { name: 'Projector / LED Screen', icon: 'Tv' },
      { name: 'Sound System', icon: 'Volume2' },
      { name: 'WiFi', icon: 'Wifi' },
      { name: 'Stage', icon: 'Mic' },
      { name: 'AC', icon: 'Wind' },
      { name: 'Parking', icon: 'Car' },
      { name: 'Food / Catering', icon: 'Utensils' },
      { name: 'Power Backup', icon: 'Zap' },
      { name: 'Green Room', icon: 'DoorClosed' },
      { name: 'Photography Area', icon: 'Camera' }
    ],
    availability: '🟢 Available on Select Dates',
    managerContact: {
      name: 'Booking Managed by HappyMoments',
      phone: '7330732710',
      whatsapp: '7330732710',
      email: 'business@happymomentsindia.com'
    },
    rating: 4.8,
    reviewsCount: 29,
    availableFrom: 'Immediate Booking',
    featured: false
  },

  // =========================================================================
  // SECTION 2: PREMIER ARENAS & CONVENTION CENTERS (₹1.75L – ₹3.5L)
  // =========================================================================

  // 6. T-Hub Catalyst Ground & Atrium - ₹1,75,000 (Real T-Hub Phase 2 Architecture Photos)
  {
    id: 'venue-thub-catalyst',
    title: 'T-Hub Catalyst Ground & Atrium',
    category: 'product_launch',
    categoryLabel: 'Flagship Tech Arena',
    section: 'featured_launch',
    tagline: 'Premier Innovation Hub & Keynote Arena with 4K Curved LED Wall for Flagship Launches',
    city: 'Hyderabad',
    locality: 'Madhapur',
    address: 'T-Hub Phase 2, 20 Inorbit Mall Rd, Vittal Rao Nagar, Madhapur, Hyderabad, Telangana 500081',
    pricing: {
      amount: 175000,
      unit: 'starting price',
      displayPrice: 'Starting from ₹1,75,000'
    },
    discountOffer: 'Book via HappyMoments & get 5% more discount',
    discountPercent: 5,
    bookingManagedBy: 'Booking Managed by HappyMoments',
    dimensions: '14,000 sq.ft.',
    capacity: 'Up to 1,500 Guests',
    capacityDetails: {
      minGuests: 100,
      maxGuests: 1500,
      seatingCapacity: 900,
      standingCapacity: 1500
    },
    spaceDetails: {
      totalArea: '14,000 sq.ft.',
      stage: 'Custom Elevated Keynote Stage',
      parking: 'Multi-Level Covered Parking for 800+ Cars'
    },
    images: [
      "https://mir-s3-cdn-cf.behance.net/project_modules/1400/b6350132455917.5683bb64496a7.jpg",
      "https://wdesignstudio.in/wp-content/uploads/2024/07/ANS_0236-1.jpg",
      "https://i.ytimg.com/vi/94VoOhFtLHQ/maxresdefault.jpg",
      "https://bl-i.thgim.com/public/incoming/jpa287/article65578413.ece/alternates/FREE_660/28hyngg_T-Hub%2015.jpg",
      "https://bl-i.thgim.com/public/incoming/8tvnyn/article65578410.ece/alternates/FREE_660/28hyngg_T-Hub%2014.jpg",
      "https://mir-s3-cdn-cf.behance.net/project_modules/1400/e0d43332455917.5683bb644a6c8.jpg"
],
    catalogImages: [
      "https://mir-s3-cdn-cf.behance.net/project_modules/1400/b6350132455917.5683bb64496a7.jpg",
      "https://wdesignstudio.in/wp-content/uploads/2024/07/ANS_0236-1.jpg",
      "https://i.ytimg.com/vi/94VoOhFtLHQ/maxresdefault.jpg",
      "https://bl-i.thgim.com/public/incoming/jpa287/article65578413.ece/alternates/FREE_660/28hyngg_T-Hub%2015.jpg",
      "https://bl-i.thgim.com/public/incoming/8tvnyn/article65578410.ece/alternates/FREE_660/28hyngg_T-Hub%2014.jpg",
      "https://mir-s3-cdn-cf.behance.net/project_modules/1400/e0d43332455917.5683bb644a6c8.jpg"
],
    features: [
      'P3 High-Definition Curved LED Video Wall',
      'Line Array Concert Sound Rig & Wireless Microphones',
      'VIP Media Lounge & Broadcast-Ready Fiber Internet',
      'Spillover Exhibition Atrium with Pre-Function Area'
    ],
    idealFor: [
      'Tech Product Launches',
      'Investor Summits',
      'Developer Keynotes',
      'Corporate Summits'
    ],
    amenities: [
      { name: 'Projector / LED Screen', icon: 'Tv' },
      { name: 'Sound System', icon: 'Volume2' },
      { name: 'WiFi', icon: 'Wifi' },
      { name: 'Stage', icon: 'Mic' },
      { name: 'AC', icon: 'Wind' },
      { name: 'Parking', icon: 'Car' },
      { name: 'Food / Catering', icon: 'Utensils' },
      { name: 'Power Backup', icon: 'Zap' },
      { name: 'Green Room', icon: 'DoorClosed' },
      { name: 'Photography Area', icon: 'Camera' }
    ],
    availability: '🟢 Available for Immediate Inquiry',
    managerContact: {
      name: 'Booking Managed by HappyMoments',
      phone: '7330732710',
      whatsapp: '7330732710',
      email: 'business@happymomentsindia.com'
    },
    rating: 4.9,
    reviewsCount: 54,
    availableFrom: 'Immediate Booking',
    featured: true
  },

  // 7. HICC Grand Ballroom & Arena - ₹2,50,000 (Real Novotel / HICC Hyderabad Photos)
  {
    id: 'venue-hicc-grand-ballroom',
    title: 'HICC Grand Ballroom & Arena',
    category: 'product_launch',
    categoryLabel: 'Convention Center Arena',
    section: 'featured_launch',
    tagline: 'International Standard Convention Facility with Acoustic Partitioning for Mega Launches',
    city: 'Hyderabad',
    locality: 'HITEC City',
    address: 'Novotel & HICC Complex, Near HITEC City, PO Bag 1101, Cyberabad Post Office, Hyderabad, Telangana 500081',
    pricing: {
      amount: 250000,
      unit: 'starting price',
      displayPrice: 'Starting from ₹2,50,000'
    },
    discountOffer: 'Book via HappyMoments & get 5% more discount',
    discountPercent: 5,
    bookingManagedBy: 'Booking Managed by HappyMoments',
    dimensions: '22,000 sq.ft.',
    capacity: 'Up to 2,500 Guests',
    capacityDetails: {
      minGuests: 250,
      maxGuests: 2500,
      seatingCapacity: 1800,
      standingCapacity: 2500
    },
    spaceDetails: {
      totalArea: '22,000 sq.ft.',
      stage: '60ft Motorized Truss Stage',
      parking: 'Over 2,000 Reserved Event Parking Bays'
    },
    images: [
      "https://hicc.com/wp-content/uploads/2020/01/home-3.jpg",
      "https://r1imghtlak.mmtcdn.com/6cb4e6d2553511e9bf540242ac110002.jpg",
      "https://d2e5ushqwiltxm.cloudfront.net/wp-content/uploads/sites/120/2017/04/11083356/Novotel-Hyderabad-05-Cop-1024x502.jpg",
      "https://hicc.com/wp-content/uploads/2020/02/Novotel-Hyderabad-Convention-Centre.jpg",
      "https://image.slidesharecdn.com/presentationh-150210000413-conversion-gate02/75/Hyderabad-International-Convention-Centre-H-I-C-C-2-2048.jpg",
      "https://images.travelandleisureasia.com/wp-content/uploads/sites/2/2019/09/Novetel-HYD-insides.jpg"
],
    catalogImages: [
      "https://hicc.com/wp-content/uploads/2020/01/home-3.jpg",
      "https://r1imghtlak.mmtcdn.com/6cb4e6d2553511e9bf540242ac110002.jpg",
      "https://d2e5ushqwiltxm.cloudfront.net/wp-content/uploads/sites/120/2017/04/11083356/Novotel-Hyderabad-05-Cop-1024x502.jpg",
      "https://hicc.com/wp-content/uploads/2020/02/Novotel-Hyderabad-Convention-Centre.jpg",
      "https://image.slidesharecdn.com/presentationh-150210000413-conversion-gate02/75/Hyderabad-International-Convention-Centre-H-I-C-C-2-2048.jpg",
      "https://images.travelandleisureasia.com/wp-content/uploads/sites/2/2019/09/Novetel-HYD-insides.jpg"
],
    features: [
      'Pillarless Grand Hall with 18-meter High Ceiling',
      'Automated Moving Head Truss & DMX Lighting Array',
      'Simultaneous Translation Booths & Press Conference Suite',
      'Direct Freight Elevator for Heavy Vehicle / Hardware Demos'
    ],
    idealFor: [
      'Auto & EV Launches',
      'International Expos',
      'Annual Global Conventions',
      'Mega Trade Shows'
    ],
    amenities: [
      { name: 'Projector / LED Screen', icon: 'Tv' },
      { name: 'Sound System', icon: 'Volume2' },
      { name: 'WiFi', icon: 'Wifi' },
      { name: 'Stage', icon: 'Mic' },
      { name: 'AC', icon: 'Wind' },
      { name: 'Parking', icon: 'Car' },
      { name: 'Food / Catering', icon: 'Utensils' },
      { name: 'Power Backup', icon: 'Zap' },
      { name: 'Green Room', icon: 'DoorClosed' },
      { name: 'Photography Area', icon: 'Camera' }
    ],
    availability: '🟢 Selected Slots Available for Next Month',
    managerContact: {
      name: 'Booking Managed by HappyMoments',
      phone: '7330732710',
      whatsapp: '7330732710',
      email: 'business@happymomentsindia.com'
    },
    rating: 4.9,
    reviewsCount: 68,
    availableFrom: 'Immediate Booking',
    featured: true
  },

  // 8. ITC Kohenur Grand Ballroom - ₹3,50,000 (Real ITC Kohenur Madhapur Photos)
  {
    id: 'venue-itc-kohenur-ballroom',
    title: 'ITC Kohenur Grand Ballroom',
    category: 'product_launch',
    categoryLabel: 'Luxury Arena',
    section: 'featured_launch',
    tagline: 'Ultra-Luxury 5-Star Pillarless Ballroom with DMX Lighting & Private VIP Executive Suites',
    city: 'Hyderabad',
    locality: 'Knowledge City / Raidurg',
    address: 'ITC Kohenur, Knowledge City, Madhapur (HITEC City), Hyderabad, Telangana 500081',
    pricing: {
      amount: 350000,
      unit: 'starting price',
      displayPrice: 'Starting from ₹3,50,000'
    },
    discountOffer: 'Book via HappyMoments & get 5% more discount',
    discountPercent: 5,
    bookingManagedBy: 'Booking Managed by HappyMoments',
    dimensions: '18,500 sq.ft.',
    capacity: 'Up to 1,800 Guests',
    capacityDetails: {
      minGuests: 150,
      maxGuests: 1800,
      seatingCapacity: 1200,
      standingCapacity: 1800
    },
    spaceDetails: {
      totalArea: '18,500 sq.ft.',
      stage: 'Built-in 45ft Elevated Presentation Deck',
      parking: 'Complimentary Valet for 1,000 Cars'
    },
    images: [
      "https://www.itchotels.com/content/dam/itchotels/in/umbrella/itc/hotels/itckohenur-hyderabad/images/overview/overview-desktop/lobby.png",
      "http://jaldhiinfo.com/wp-content/uploads/2024/01/3-14.jpg",
      "https://images.trvl-media.com/hotels/25000000/24300000/24290700/24290609/b86fe8f9_z.jpg",
      "https://www.itchotels.com/content/dam/itchotels/in/umbrella/itc/hotels/itckohenur-hyderabad/images/overview/accommodation/luxury-suite_new.jpg",
      "https://assets.architecturaldigest.in/photos/600825ce1363405bf8eb5098/master/w_1600%2Cc_limit/Lobby.jpg",
      "https://www.itchotels.com/content/dam/itchotels/in/umbrella/itc/hotels/itckohenur-hyderabad/images/overview/accommodation/itc-one.png"
],
    catalogImages: [
      "https://www.itchotels.com/content/dam/itchotels/in/umbrella/itc/hotels/itckohenur-hyderabad/images/overview/overview-desktop/lobby.png",
      "http://jaldhiinfo.com/wp-content/uploads/2024/01/3-14.jpg",
      "https://images.trvl-media.com/hotels/25000000/24300000/24290700/24290609/b86fe8f9_z.jpg",
      "https://www.itchotels.com/content/dam/itchotels/in/umbrella/itc/hotels/itckohenur-hyderabad/images/overview/accommodation/luxury-suite_new.jpg",
      "https://assets.architecturaldigest.in/photos/600825ce1363405bf8eb5098/master/w_1600%2Cc_limit/Lobby.jpg",
      "https://www.itchotels.com/content/dam/itchotels/in/umbrella/itc/hotels/itckohenur-hyderabad/images/overview/accommodation/itc-one.png"
],
    features: [
      'Pillarless Architectural Wonder Overlooking Durgam Cheruvu Lake',
      'Smart Programmable Intelligent Ceiling Chandeliers',
      'Dedicated Presidential Green Rooms with Private Restrooms',
      'Michelin-Grade In-House Catering Kitchen'
    ],
    idealFor: [
      'Luxury Brand Launches',
      'High-Profile Celebrity Galas',
      'National Brand Reveals',
      'Enterprise Technology Summits'
    ],
    amenities: [
      { name: 'Projector / LED Screen', icon: 'Tv' },
      { name: 'Sound System', icon: 'Volume2' },
      { name: 'WiFi', icon: 'Wifi' },
      { name: 'Stage', icon: 'Mic' },
      { name: 'AC', icon: 'Wind' },
      { name: 'Parking', icon: 'Car' },
      { name: 'Food / Catering', icon: 'Utensils' },
      { name: 'Power Backup', icon: 'Zap' },
      { name: 'Green Room', icon: 'DoorClosed' },
      { name: 'Photography Area', icon: 'Camera' }
    ],
    availability: '🟢 Booking Open for Q3 & Q4',
    managerContact: {
      name: 'Booking Managed by HappyMoments',
      phone: '7330732710',
      whatsapp: '7330732710',
      email: 'business@happymomentsindia.com'
    },
    rating: 5.0,
    reviewsCount: 42,
    availableFrom: 'Immediate Booking',
    featured: true
  }
];
