import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useBusinessAuth } from '@/contexts/BusinessAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
  Building2, 
  MapPin, 
  Users, 
  Search, 
  LogOut, 
  Check, 
  X, 
  Eye, 
  Phone, 
  PhoneCall, 
  MessageCircle, 
  Calendar, 
  Clock, 
  Send, 
  PlusCircle, 
  Sparkles,
  Store,
  Megaphone,
  LayoutGrid,
  Tv,
  Volume2,
  Wifi,
  Mic,
  Wind,
  Car,
  Utensils,
  Zap,
  DoorClosed,
  Camera,
  CheckCircle2,
  FileText,
  HelpCircle,
  Maximize2,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Trash2,
  ShieldCheck
} from 'lucide-react';
import { 
  BUSINESS_SPACES, 
  BusinessSpace, 
  HAPPYMOMENTS_SUPPORT_PHONE, 
  HAPPYMOMENTS_WHATSAPP_NUMBER 
} from '@/data/businessSpacesData';

export const FORMAT_CATEGORIES = [
  { 
    id: 'all', 
    label: 'All Spaces', 
    tagline: '50+ Verified Venues',
    detail: 'Across Hyderabad & Metro Hubs',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80',
    icon: LayoutGrid,
    color: 'text-amber-500',
    bgLight: 'bg-amber-50'
  },
  { 
    id: 'product_launch', 
    label: 'Product Launches', 
    tagline: 'Keynotes & Reveals',
    detail: 'Concert Sound & 4K LED Screen',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=400&q=80',
    icon: Sparkles,
    color: 'text-orange-500',
    bgLight: 'bg-orange-50'
  },
  { 
    id: 'stall_booking', 
    label: 'Stall & Pop-Ups', 
    tagline: '35,000+ Footfall',
    detail: 'Tech Parks & Mall Atriums',
    image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=400&q=80',
    icon: Store,
    color: 'text-blue-500',
    bgLight: 'bg-blue-50'
  },
  { 
    id: 'corporate_summit', 
    label: 'Corporate Summits', 
    tagline: 'Executive Boardrooms',
    detail: 'Acoustic Convention Halls',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=400&q=80',
    icon: Building2,
    color: 'text-emerald-500',
    bgLight: 'bg-emerald-50'
  },
  { 
    id: 'brand_activation', 
    label: 'Brand Activations', 
    tagline: 'Experiential Zones',
    detail: 'Campus & Open Grounds',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=400&q=80',
    icon: Megaphone,
    color: 'text-purple-500',
    bgLight: 'bg-purple-50'
  }
];

const BusinessDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const { 
    businessOwner, 
    signOut, 
    inquiries, 
    addInquiry,
    interestedVenueIds,
    notInterestedVenueIds,
    toggleInterestedVenue,
    markNotInterestedVenue,
    undoNotInterestedVenue,
    isInterested,
    isNotInterested,
    clearNotInterestedVenues
  } = useBusinessAuth();

  // Active Main Navigation: 'explore' | 'interested' | 'inquiries' | 'post-requirement'
  const [activeTab, setActiveTab] = useState<'explore' | 'interested' | 'inquiries' | 'post-requirement'>('explore');

  // Filter Bar State
  const [filterLocation, setFilterLocation] = useState<string>('all');
  const [filterCapacity, setFilterCapacity] = useState<string>('all');
  const [filterBudget, setFilterBudget] = useState<string>('all');
  const [filterVenueType, setFilterVenueType] = useState<string>(initialCategory);
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // Sync category param when URL search changes
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && cat !== filterVenueType) {
      setFilterVenueType(cat);
    } else if (!cat && filterVenueType !== 'all') {
      setFilterVenueType('all');
    }
  }, [searchParams]);

  // Handler for category format change
  const handleSelectVenueType = (catId: string) => {
    setFilterVenueType(catId);
    const newParams = new URLSearchParams(searchParams);
    if (catId === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', catId);
    }
    setSearchParams(newParams, { replace: true });
  };

  // Selected Venue for Details Modal
  const [selectedVenue, setSelectedVenue] = useState<BusinessSpace | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [talkExecutiveModalOpen, setTalkExecutiveModalOpen] = useState(false);

  // Inquiry Modal State
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [inquiryDate, setInquiryDate] = useState('');
  const [inquiryDuration, setInquiryDuration] = useState('1');
  const [inquiryFootfall, setInquiryFootfall] = useState('500');
  const [inquiryNotes, setInquiryNotes] = useState('');
  const [inquirySuccess, setInquirySuccess] = useState(false);

  // Post Custom Requirement State
  const [customReqData, setCustomReqData] = useState({
    eventType: 'Product Launch',
    city: 'Hyderabad',
    preferredLocality: '',
    dates: '',
    expectedGuests: '500',
    budget: '₹1,50,000',
    requirements: ''
  });
  const [customReqSuccess, setCustomReqSuccess] = useState(false);

  // Handle opening View Details
  const handleOpenDetails = (venue: BusinessSpace) => {
    setSelectedVenue(venue);
    setActiveImageIndex(0);
    setDetailsModalOpen(true);
  };

  // WhatsApp Connect Generator
  const generateWhatsAppLink = (venueTitle: string) => {
    const text = `Hi HappyMoments! 👋\n\nWe would like to know more details about ${venueTitle}.\n\nPlease share the availability, pricing and booking details for this venue.\n\nThank you!`;
    return `https://wa.me/917330732710?text=${encodeURIComponent(text)}`;
  };

  // WhatsApp Shortlist Connect Generator
  const generateShortlistWhatsAppLink = (venues: BusinessSpace[]) => {
    const listLines = venues.map((v, i) => `${i + 1}. ${v.title} (${v.locality}, ${v.pricing.displayPrice})`).join('\n');
    const text = `Hi HappyMoments! 👋\n\nI have shortlisted these venues from the business portal for my upcoming event:\n\n${listLines}\n\nPlease share the availability, pricing packages, and booking details for these venues.\n\nThank you!`;
    return `https://wa.me/917330732710?text=${encodeURIComponent(text)}`;
  };

  // Interested Venues List
  const interestedVenues = useMemo(() => {
    return BUSINESS_SPACES.filter(v => interestedVenueIds.includes(v.id));
  }, [interestedVenueIds]);

  // Submit Direct Inquiry
  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVenue) return;

    addInquiry({
      spaceId: selectedVenue.id,
      spaceTitle: selectedVenue.title,
      spaceCategory: selectedVenue.categoryLabel,
      spaceCity: selectedVenue.city,
      pricing: selectedVenue.pricing.displayPrice,
      eventDate: inquiryDate || 'Flexible / To be finalized',
      durationDays: parseInt(inquiryDuration) || 1,
      expectedFootfall: parseInt(inquiryFootfall) || 500,
      requirements: inquiryNotes || 'General booking inquiry through portal'
    });

    // Automatically open WhatsApp with pre-filled venue message
    window.open(generateWhatsAppLink(selectedVenue.title), '_blank');

    setInquirySuccess(true);
    setTimeout(() => {
      setInquirySuccess(false);
      setInquiryModalOpen(false);
      setDetailsModalOpen(false);
    }, 2000);
  };

  // Submit Custom Requirement
  const handleCustomReqSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addInquiry({
      spaceId: `custom-req-${Date.now()}`,
      spaceTitle: `Custom Requirement: ${customReqData.eventType}`,
      spaceCategory: 'Custom Event Format',
      spaceCity: customReqData.city,
      pricing: customReqData.budget,
      eventDate: customReqData.dates || 'Upcoming',
      durationDays: 1,
      expectedFootfall: parseInt(customReqData.expectedGuests) || 300,
      requirements: `Locality: ${customReqData.preferredLocality || 'Any'}. Notes: ${customReqData.requirements}`
    });

    setCustomReqSuccess(true);
    setTimeout(() => {
      setCustomReqSuccess(false);
      setActiveTab('inquiries');
    }, 2000);
  };

  // Filtering Logic
  const filteredVenues = useMemo(() => {
    return BUSINESS_SPACES.filter(venue => {
      // Location Filter
      if (filterLocation !== 'all' && !venue.locality.toLowerCase().includes(filterLocation.toLowerCase())) {
        return false;
      }

      // Capacity Filter
      if (filterCapacity !== 'all') {
        const max = venue.capacityDetails.maxGuests;
        if (filterCapacity === 'under-200' && max > 200) return false;
        if (filterCapacity === '200-500' && (max < 200 || max > 500)) return false;
        if (filterCapacity === '500-1000' && (max < 500 || max > 1000)) return false;
        if (filterCapacity === '1000-plus' && max < 1000) return false;
      }

      // Budget Filter
      if (filterBudget !== 'all') {
        const price = venue.pricing.amount;
        if (filterBudget === 'under-50k' && price >= 50000) return false;
        if (filterBudget === '50k-100k' && (price < 50000 || price > 100000)) return false;
        if (filterBudget === '100k-200k' && (price < 100000 || price > 200000)) return false;
        if (filterBudget === 'above-200k' && price < 200000) return false;
      }

      // Venue Type / Format Filter
      if (filterVenueType !== 'all') {
        if (filterVenueType === 'product_launch') {
          const match = venue.category === 'product_launch' || venue.idealFor.some(i => i.toLowerCase().includes('launch') || i.toLowerCase().includes('demonstration'));
          if (!match) return false;
        } else if (filterVenueType === 'stall_booking') {
          const match = venue.idealFor.some(i => 
            i.toLowerCase().includes('stall') || 
            i.toLowerCase().includes('exhibition') || 
            i.toLowerCase().includes('pop') ||
            i.toLowerCase().includes('demonstration')
          ) || venue.features.some(f => 
            f.toLowerCase().includes('kiosk') || 
            f.toLowerCase().includes('atrium') || 
            f.toLowerCase().includes('demo') ||
            f.toLowerCase().includes('booth')
          );
          if (!match) return false;
        } else if (filterVenueType === 'corporate_summit') {
          const match = venue.idealFor.some(i => 
            i.toLowerCase().includes('summit') || 
            i.toLowerCase().includes('conference') || 
            i.toLowerCase().includes('corporate') ||
            i.toLowerCase().includes('business') ||
            i.toLowerCase().includes('tech')
          );
          if (!match) return false;
        } else if (filterVenueType === 'brand_activation') {
          const match = venue.idealFor.some(i => 
            i.toLowerCase().includes('brand') || 
            i.toLowerCase().includes('activation') || 
            i.toLowerCase().includes('creator') ||
            i.toLowerCase().includes('student') ||
            i.toLowerCase().includes('networking')
          ) || venue.category === 'college_space';
          if (!match) return false;
        } else if (filterVenueType === 'college_space') {
          if (venue.category !== 'college_space') return false;
        }
      }

      // Keyword Search
      if (searchKeyword.trim()) {
        const q = searchKeyword.toLowerCase();
        const matchesTitle = venue.title.toLowerCase().includes(q);
        const matchesLocality = venue.locality.toLowerCase().includes(q);
        const matchesCat = venue.categoryLabel.toLowerCase().includes(q);
        if (!matchesTitle && !matchesLocality && !matchesCat) return false;
      }

      return true;
    });
  }, [filterLocation, filterCapacity, filterBudget, filterVenueType, searchKeyword]);

  // Active Category Meta
  const activeCategoryMeta = FORMAT_CATEGORIES.find(c => c.id === filterVenueType);

  // Split into Section 1 (₹10K – ₹40K Budget Friendly) & Section 2 (Premium Arenas & Conventions)
  const budgetFriendlyVenues = filteredVenues.filter(v => v.pricing.amount <= 40000);
  const premiumVenues = filteredVenues.filter(v => v.pricing.amount > 40000);

  // Reset Filters
  const resetFilters = () => {
    setFilterLocation('all');
    setFilterCapacity('all');
    setFilterBudget('all');
    handleSelectVenueType('all');
    setSearchKeyword('');
  };

  const hasActiveFilters = filterLocation !== 'all' || filterCapacity !== 'all' || filterBudget !== 'all' || filterVenueType !== 'all' || searchKeyword !== '';

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans antialiased">
      
      {/* ========================================================================= */}
      {/* 1. PORTAL HEADER                                                          */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/business" className="flex items-center gap-2 sm:gap-2.5">
              <img
                src="/images/logo.jpg"
                alt="HappyMoments HM Logo"
                className="w-8 h-8 sm:w-9 sm:h-9 object-contain rounded-lg shadow-xs"
              />
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="text-base sm:text-xl font-black tracking-tight text-slate-900">
                  Happy<span className="text-[#f58200]">Moments</span>
                </span>
                <span className="text-slate-300 font-light text-sm sm:text-lg">|</span>
                <span className="text-[9px] sm:text-xs font-bold tracking-wider uppercase bg-slate-900 text-white px-1.5 sm:px-2 py-0.5 rounded">
                  Business
                </span>
              </div>
            </Link>
          </div>

          {/* Center Navigation Tabs (Desktop) */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('explore')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'explore'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Search className="h-4 w-4" />
              <span>Explore Venues</span>
            </button>

            <button
              onClick={() => setActiveTab('interested')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 relative ${
                activeTab === 'interested'
                  ? 'bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200/70'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <ThumbsUp className="h-4 w-4 text-emerald-600" />
              <span>Interested List</span>
              {interestedVenueIds.length > 0 && (
                <span className="bg-emerald-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                  {interestedVenueIds.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 relative ${
                activeTab === 'inquiries'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>My Inquiries</span>
              {inquiries.length > 0 && (
                <span className="bg-[#f58200] text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full">
                  {inquiries.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('post-requirement')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'post-requirement'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <PlusCircle className="h-4 w-4" />
              <span>Post Custom Requirement</span>
            </button>
          </nav>

          {/* Right User Profile & Sign Out */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Talk with Executive Button */}
            <button
              onClick={() => setTalkExecutiveModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 transition-all shadow-xs"
              title="Directly Call or WhatsApp Executive to Finalize"
            >
              <PhoneCall className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span className="hidden sm:inline">Talk with Executive</span>
              <span className="sm:hidden">Executive</span>
            </button>

            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-semibold text-slate-900">
                {businessOwner?.companyName || 'Aura Innovations'}
              </span>
              <span className="text-[11px] text-slate-500">
                {businessOwner?.fullName || 'Business Member'}
              </span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                signOut();
                navigate('/business');
              }}
              className="text-slate-600 hover:text-red-600 hover:bg-red-50 text-xs gap-1 sm:gap-1.5 px-2.5 sm:px-3"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden xs:inline sm:inline">Sign Out</span>
            </Button>
          </div>

        </div>

        {/* Mobile Navigation Row (Touch-Friendly Segmented Tabs) */}
        <div className="md:hidden flex items-center justify-between border-t border-slate-100 px-2 py-2 bg-slate-50/80 text-xs gap-1">
          <button
            onClick={() => setActiveTab('explore')}
            className={`flex-1 py-2 px-1 rounded-xl font-semibold flex items-center justify-center gap-1 transition-all text-[11px] ${
              activeTab === 'explore'
                ? 'bg-white text-[#f58200] shadow-xs border border-orange-200/60 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Search className="h-3.5 w-3.5 shrink-0" />
            <span>Venues</span>
          </button>
          <button
            onClick={() => setActiveTab('interested')}
            className={`flex-1 py-2 px-1 rounded-xl font-semibold flex items-center justify-center gap-1 transition-all text-[11px] relative ${
              activeTab === 'interested'
                ? 'bg-white text-emerald-700 shadow-xs border border-emerald-300 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ThumbsUp className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
            <span>Interested</span>
            {interestedVenueIds.length > 0 && (
              <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {interestedVenueIds.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`flex-1 py-2 px-1 rounded-xl font-semibold flex items-center justify-center gap-1 transition-all text-[11px] relative ${
              activeTab === 'inquiries'
                ? 'bg-white text-[#f58200] shadow-xs border border-orange-200/60 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="h-3.5 w-3.5 shrink-0" />
            <span>Inquiries</span>
            {inquiries.length > 0 && (
              <span className="bg-[#f58200] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {inquiries.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('post-requirement')}
            className={`flex-1 py-2 px-1 rounded-xl font-semibold flex items-center justify-center gap-1 transition-all text-[11px] ${
              activeTab === 'post-requirement'
                ? 'bg-white text-[#f58200] shadow-xs border border-orange-200/60 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PlusCircle className="h-3.5 w-3.5 shrink-0" />
            <span>Post</span>
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN CONTENT AREA                                                      */}
      {/* ========================================================================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

        {/* TAB 1: EXPLORE VENUES */}
        {activeTab === 'explore' && (
          <div className="space-y-10">
            
            {/* Page Heading */}
            <div className="space-y-1.5">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Find the Right Venue for Your Event
              </h1>
              <p className="text-slate-600 text-sm sm:text-base">
                Explore curated venues for product launches, exhibitions, corporate events and brand experiences.
              </p>
            </div>

            {/* Square Grids Sections Model (Interactive Format Tiles with Mini Images) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Select Event Format / Category
                </span>
                {filterVenueType !== 'all' && (
                  <button
                    onClick={() => handleSelectVenueType('all')}
                    className="text-xs text-[#f58200] hover:underline font-semibold"
                  >
                    Reset to All Spaces
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                {FORMAT_CATEGORIES.map(cat => {
                  const Icon = cat.icon;
                  const isSelected = filterVenueType === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleSelectVenueType(cat.id)}
                      className={`group p-3 sm:p-3.5 rounded-2xl sm:rounded-3xl border text-left flex flex-col justify-between transition-all duration-300 relative overflow-hidden cursor-pointer ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xl ring-2 ring-[#f58200] scale-[1.02]'
                          : 'bg-white hover:bg-slate-50/90 border-slate-200 text-slate-900 hover:border-slate-300 hover:shadow-md'
                      }`}
                    >
                      {/* Active Indicator Pip */}
                      {isSelected && (
                        <div className="absolute top-2.5 right-2.5 z-10 w-2.5 h-2.5 rounded-full bg-[#f58200] ring-4 ring-orange-400/40"></div>
                      )}

                      {/* Mini Image Thumbnail */}
                      <div className="relative w-full aspect-[16/10] rounded-xl sm:rounded-2xl overflow-hidden bg-slate-100 mb-2.5 shadow-xs">
                        <img
                          src={cat.image}
                          alt={cat.label}
                          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                        {/* Format Icon Floating Badge */}
                        <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2">
                          <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center backdrop-blur-md shadow-xs transition-transform group-hover:scale-110 ${
                            isSelected ? 'bg-[#f58200] text-white' : 'bg-white/95 text-slate-800'
                          }`}>
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                        </div>

                        {/* Tagline Badge inside Mini Image */}
                        <div className="absolute bottom-1.5 left-2 right-2">
                          <span className="text-[10px] sm:text-[11px] font-bold text-white tracking-wide drop-shadow-sm truncate block">
                            {cat.tagline}
                          </span>
                        </div>
                      </div>

                      {/* Label & Format Detail */}
                      <div className="space-y-0.5">
                        <h3 className={`text-xs sm:text-sm font-bold leading-snug line-clamp-1 ${
                          isSelected ? 'text-white' : 'text-slate-900 group-hover:text-[#f58200]'
                        }`}>
                          {cat.label}
                        </h3>
                        <p className={`text-[10px] sm:text-[11px] line-clamp-1 font-medium ${
                          isSelected ? 'text-amber-300' : 'text-slate-500'
                        }`}>
                          {cat.detail}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Simple Filter Bar */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* 1. Location */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    <span>Location</span>
                  </Label>
                  <Select value={filterLocation} onValueChange={setFilterLocation}>
                    <SelectTrigger className="text-xs rounded-xl bg-slate-50/50 border-slate-200">
                      <SelectValue placeholder="All Locations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations (Hyderabad)</SelectItem>
                      <SelectItem value="madhapur">HITEC City / Madhapur</SelectItem>
                      <SelectItem value="raidurg">Raidurg / Knowledge City</SelectItem>
                      <SelectItem value="kothaguda">Kothaguda</SelectItem>
                      <SelectItem value="chandanagar">Chandanagar</SelectItem>
                      <SelectItem value="kokapet">Kokapet / Gandipet</SelectItem>
                      <SelectItem value="kphb">KPHB / Kukatpally</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 2. Guest Capacity */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 text-slate-400" />
                    <span>Guest Capacity</span>
                  </Label>
                  <Select value={filterCapacity} onValueChange={setFilterCapacity}>
                    <SelectTrigger className="text-xs rounded-xl bg-slate-50/50 border-slate-200">
                      <SelectValue placeholder="All Capacities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Capacities</SelectItem>
                      <SelectItem value="under-200">Under 200 Guests</SelectItem>
                      <SelectItem value="200-500">200 – 500 Guests</SelectItem>
                      <SelectItem value="500-1000">500 – 1,000 Guests</SelectItem>
                      <SelectItem value="1000-plus">1,000+ Guests</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 3. Budget */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                    <span>💰</span>
                    <span>Budget</span>
                  </Label>
                  <Select value={filterBudget} onValueChange={setFilterBudget}>
                    <SelectTrigger className="text-xs rounded-xl bg-slate-50/50 border-slate-200">
                      <SelectValue placeholder="All Budgets" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Budgets</SelectItem>
                      <SelectItem value="under-50k">Under ₹50,000</SelectItem>
                      <SelectItem value="50k-100k">₹50,000 – ₹1,00,000</SelectItem>
                      <SelectItem value="100k-200k">₹1,00,000 – ₹2,00,000</SelectItem>
                      <SelectItem value="above-200k">Above ₹2,00,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 4. Venue Type */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5 text-slate-400" />
                    <span>Venue Format</span>
                  </Label>
                  <Select value={filterVenueType} onValueChange={handleSelectVenueType}>
                    <SelectTrigger className="text-xs rounded-xl bg-slate-50/50 border-slate-200">
                      <SelectValue placeholder="All Spaces" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Spaces (All Formats)</SelectItem>
                      <SelectItem value="product_launch">Product Launches</SelectItem>
                      <SelectItem value="stall_booking">Stall & Pop-Ups</SelectItem>
                      <SelectItem value="corporate_summit">Corporate Summits</SelectItem>
                      <SelectItem value="brand_activation">Brand Activations</SelectItem>
                      <SelectItem value="college_space">College & Campus Spaces</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

              </div>

              {/* Bottom Search & Filter Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <div className="relative w-full sm:w-72">
                  <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input 
                    type="text"
                    placeholder="Search by venue name..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="pl-8 text-xs rounded-lg h-9 bg-slate-50/50 border-slate-200"
                  />
                </div>

                <div className="flex items-center gap-2 self-end">
                  {hasActiveFilters && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={resetFilters}
                      className="text-xs text-slate-500 hover:text-slate-800 h-9"
                    >
                      Reset Filters
                    </Button>
                  )}
                  <Button 
                    size="sm" 
                    className="bg-[#f58200] hover:bg-[#e07500] text-white text-xs font-semibold px-5 h-9 rounded-lg"
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </div>

            {/* VENUES RENDERING: ALL SPACES VS ACTIVE FILTER CATEGORY */}
            {filterVenueType === 'all' ? (
              <>
                {/* SECTION 1: ✨ Budget-Friendly Event Spaces (₹10,000 – ₹40,000) */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden border border-emerald-200 shadow-xs shrink-0 bg-emerald-50 flex items-center justify-center text-2xl">
                      ✨
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                          Budget-Friendly Event Spaces (₹10,000 – ₹40,000)
                        </h2>
                        <span className="bg-emerald-100 text-emerald-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-200">
                          Best Value
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Affordable, high-capacity seminar halls, auditoriums, and demo lounges in prime Hyderabad hubs with 5% extra discount.
                      </p>
                    </div>
                  </div>

                  {budgetFriendlyVenues.length === 0 ? (
                    <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500 text-sm">
                      No budget-friendly venues match the selected filters. Try adjusting your filters.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {budgetFriendlyVenues.map((venue) => (
                        <VenueCard 
                          key={venue.id} 
                          venue={venue} 
                          onOpenDetails={handleOpenDetails}
                          isInterested={isInterested(venue.id)}
                          isNotInterested={isNotInterested(venue.id)}
                          onToggleInterested={toggleInterestedVenue}
                          onMarkNotInterested={markNotInterestedVenue}
                          onUndoNotInterested={undoNotInterestedVenue}
                        />
                      ))}
                    </div>
                  )}
                </section>

                {/* SECTION 2: ⭐ Premium Convention & Large Arenas */}
                <section className="space-y-6 pt-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden border border-amber-200 shadow-xs shrink-0 bg-amber-50 flex items-center justify-center text-2xl">
                      ⭐
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                          Premium Arenas & Convention Centers
                        </h2>
                        <span className="bg-amber-100 text-amber-900 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-amber-200">
                          Flagship Venues
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        High-impact commercial venues with concert-grade audiovisual facilities, tiered seating, and dedicated VIP press lounges.
                      </p>
                    </div>
                  </div>

                  {premiumVenues.length === 0 ? (
                    <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500 text-sm">
                      No premium arenas match the selected filters. Try adjusting your filters.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {premiumVenues.map((venue) => (
                        <VenueCard 
                          key={venue.id} 
                          venue={venue} 
                          onOpenDetails={handleOpenDetails}
                          isInterested={isInterested(venue.id)}
                          isNotInterested={isNotInterested(venue.id)}
                          onToggleInterested={toggleInterestedVenue}
                          onMarkNotInterested={markNotInterestedVenue}
                          onUndoNotInterested={undoNotInterestedVenue}
                        />
                      ))}
                    </div>
                  )}
                </section>
              </>
            ) : (
              /* ACTIVE FILTERED CATEGORY VIEW */
              <section className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <div className="flex items-center gap-3.5">
                    {activeCategoryMeta?.image && (
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden border border-slate-200 shadow-xs shrink-0 bg-slate-100">
                        <img
                          src={activeCategoryMeta.image}
                          alt={activeCategoryMeta.label}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                          {activeCategoryMeta?.label || (filterVenueType === 'college_space' ? 'College & Campus Spaces' : 'Filtered Venues')}
                        </h2>
                        <span className="bg-orange-100 text-[#f58200] font-bold text-xs px-2.5 py-0.5 rounded-full">
                          {filteredVenues.length} available
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {activeCategoryMeta?.detail || 'Showing verified spaces matching your selected format and search criteria.'}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSelectVenueType('all')}
                    className="text-xs border-slate-300 hover:bg-slate-100 font-semibold self-start sm:self-center"
                  >
                    Clear Filter (View All)
                  </Button>
                </div>

                {filteredVenues.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500 text-sm space-y-3">
                    <p className="text-base font-semibold text-slate-700">No venues found for this category with the selected filters.</p>
                    <p className="text-xs text-slate-400">Try adjusting your location, guest capacity or budget filter.</p>
                    <Button
                      onClick={resetFilters}
                      className="bg-[#f58200] hover:bg-[#e07500] text-white text-xs font-semibold px-4 py-2 mt-2"
                    >
                      Reset All Filters
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredVenues.map((venue) => (
                      <VenueCard 
                        key={venue.id} 
                        venue={venue} 
                        onOpenDetails={handleOpenDetails}
                        isInterested={isInterested(venue.id)}
                        isNotInterested={isNotInterested(venue.id)}
                        onToggleInterested={toggleInterestedVenue}
                        onMarkNotInterested={markNotInterestedVenue}
                        onUndoNotInterested={undoNotInterestedVenue}
                      />
                    ))}
                  </div>
                )}
              </section>
            )}

          </div>
        )}

        {/* TAB 2: ⭐ INTERESTED LIST (SHORTLISTED VENUES) */}
        {activeTab === 'interested' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">⭐</span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    My Interested Venues
                  </h1>
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                    {interestedVenues.length} {interestedVenues.length === 1 ? 'Venue' : 'Venues'}
                  </span>
                </div>
                <p className="text-slate-600 text-xs sm:text-sm max-w-2xl">
                  Venues you have shortlisted for your event. Connect directly with the HappyMoments coordination desk to compare dates, get consolidated quotes, or arrange site visits.
                </p>
              </div>

              {interestedVenues.length > 0 && (
                <a
                  href={generateShortlistWhatsAppLink(interestedVenues)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-sm transition-all shrink-0"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>WhatsApp Coordinator with Shortlist ({interestedVenues.length})</span>
                </a>
              )}
            </div>

            {interestedVenues.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border border-slate-200 max-w-lg mx-auto space-y-4 shadow-xs">
                <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center mx-auto text-[#f58200]">
                  <ThumbsUp className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Your Interested List is Empty</h3>
                <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                  Browse through our verified venue catalog and click <strong>👍 Interested</strong> on any venue card to build your shortlist.
                </p>
                <div className="pt-2">
                  <Button
                    onClick={() => setActiveTab('explore')}
                    className="bg-[#f58200] hover:bg-[#e07500] text-white text-xs font-semibold px-6 py-2.5 rounded-xl shadow-xs"
                  >
                    Browse Venues Catalog
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {interestedVenues.map((venue) => (
                    <div key={venue.id} className="relative flex flex-col h-full">
                      <VenueCard
                        venue={venue}
                        onOpenDetails={handleOpenDetails}
                        isInterested={true}
                        isNotInterested={false}
                        onToggleInterested={toggleInterestedVenue}
                        onMarkNotInterested={markNotInterestedVenue}
                        onUndoNotInterested={undoNotInterestedVenue}
                      />
                    </div>
                  ))}
                </div>

                {/* Bottom Shortlist Help Banner */}
                <div className="bg-orange-50/70 border border-orange-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3 text-center sm:text-left">
                    <img
                      src="/images/logo.jpg"
                      alt="HappyMoments HM Logo"
                      className="w-10 h-10 rounded-xl object-contain bg-white border border-orange-200 shadow-xs shrink-0 hidden sm:block"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Need help deciding between shortlisted venues?</h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Our venue specialists will review your requirements, compare venue amenities, and negotiate package deals.
                      </p>
                    </div>
                  </div>
                  <a
                    href={generateShortlistWhatsAppLink(interestedVenues)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#25D366] hover:bg-[#20bd5a] text-white shrink-0 shadow-xs"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MY INQUIRIES */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">My Inquiries & Quotes</h1>
              <p className="text-sm text-slate-500 mt-1">
                Track status and negotiations for event venue reservations managed by HappyMoments.
              </p>
            </div>

            {inquiries.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 max-w-lg mx-auto space-y-4">
                <FileText className="h-12 w-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">No Inquiries Submitted Yet</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Browse through our verified venues, click "View Details", and submit an inquiry to receive custom commercial terms.
                </p>
                <Button 
                  onClick={() => setActiveTab('explore')}
                  className="bg-[#f58200] hover:bg-[#e07500] text-white text-xs font-semibold"
                >
                  Explore Venues Now
                </Button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="divide-y divide-slate-100">
                  {inquiries.map((inq) => (
                    <div key={inq.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#f58200]">
                            {inq.spaceCategory}
                          </span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs font-medium text-slate-500">{inq.spaceCity}</span>
                        </div>
                        <h4 className="text-lg font-bold text-slate-900">{inq.spaceTitle}</h4>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                          <span>📅 Date: <strong>{inq.eventDate}</strong></span>
                          <span>👥 Expected Footfall: <strong>{inq.expectedFootfall}</strong></span>
                          <span>💰 Indicative: <strong>{inq.pricing}</strong></span>
                        </div>
                        {inq.requirements && (
                          <p className="text-xs text-slate-500 pt-1 italic">
                            "{inq.requirements}"
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span>{inq.status}</span>
                        </span>
                        <a
                          href={generateWhatsAppLink(inq.spaceTitle)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-[#25D366] hover:bg-[#20bd5a] text-white transition-colors"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          <span>WhatsApp Manager</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: POST CUSTOM REQUIREMENT */}
        {activeTab === 'post-requirement' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">Post Custom Requirement</h1>
              <p className="text-sm text-slate-500 mt-1">
                Have a specialized format or private date? HappyMoments will source and coordinate verified venues tailored to your requirements.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs">
              {customReqSuccess ? (
                <div className="text-center py-8 space-y-3">
                  <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto" />
                  <h3 className="text-lg font-bold text-slate-900">Requirement Submitted Successfully!</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    HappyMoments booking team has received your brief. A venue coordinator will contact you on WhatsApp with shortlisted options.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleCustomReqSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-slate-700">Event Format</Label>
                      <Select 
                        value={customReqData.eventType} 
                        onValueChange={(val) => setCustomReqData({ ...customReqData, eventType: val })}
                      >
                        <SelectTrigger className="text-xs rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Product Launch">Product Launch</SelectItem>
                          <SelectItem value="Tech Conference">Tech Conference</SelectItem>
                          <SelectItem value="Exhibition Stall Setup">Exhibition Stall Setup</SelectItem>
                          <SelectItem value="Corporate Summit">Corporate Summit</SelectItem>
                          <SelectItem value="College Campus Workshop">College Campus Workshop</SelectItem>
                          <SelectItem value="Creator Meetup">Creator Meetup</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-slate-700">City</Label>
                      <Input 
                        value={customReqData.city}
                        onChange={(e) => setCustomReqData({ ...customReqData, city: e.target.value })}
                        required
                        className="text-xs rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-slate-700">Preferred Localities</Label>
                      <Input 
                        placeholder="e.g. Madhapur, Gachibowli, Kokapet"
                        value={customReqData.preferredLocality}
                        onChange={(e) => setCustomReqData({ ...customReqData, preferredLocality: e.target.value })}
                        className="text-xs rounded-xl"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-slate-700">Target Dates</Label>
                      <Input 
                        type="date"
                        value={customReqData.dates}
                        onChange={(e) => setCustomReqData({ ...customReqData, dates: e.target.value })}
                        required
                        className="text-xs rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-slate-700">Expected Guests</Label>
                      <Input 
                        placeholder="e.g. 500"
                        value={customReqData.expectedGuests}
                        onChange={(e) => setCustomReqData({ ...customReqData, expectedGuests: e.target.value })}
                        required
                        className="text-xs rounded-xl"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-slate-700">Approximate Budget</Label>
                      <Input 
                        placeholder="e.g. ₹1,50,000"
                        value={customReqData.budget}
                        onChange={(e) => setCustomReqData({ ...customReqData, budget: e.target.value })}
                        required
                        className="text-xs rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-700">Specific Requirements</Label>
                    <Textarea 
                      placeholder="Describe stage dimension requirements, LED backdrops, food catering format, parking needs..."
                      value={customReqData.requirements}
                      onChange={(e) => setCustomReqData({ ...customReqData, requirements: e.target.value })}
                      rows={4}
                      className="text-xs rounded-xl"
                    />
                  </div>

                  <Button 
                    type="submit"
                    className="w-full bg-[#f58200] hover:bg-[#e07500] text-white font-semibold py-2.5 rounded-xl text-xs mt-2"
                  >
                    Submit Custom Requirement
                  </Button>
                </form>
              )}
            </div>
          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* 3. VIEW DETAILS MODAL                                                     */}
      {/* ========================================================================= */}
      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="w-[94vw] sm:max-w-4xl max-h-[92vh] overflow-y-auto p-0 rounded-2xl sm:rounded-3xl border-slate-200">
          {selectedVenue && (
            <div className="flex flex-col">
              
              {/* Header Bar */}
              <div className="p-4 sm:p-6 pb-3 sm:pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#f58200] bg-orange-50 px-2.5 py-1 rounded-md">
                    {selectedVenue.categoryLabel}
                  </span>
                  <DialogTitle className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                    {selectedVenue.title}
                  </DialogTitle>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>{selectedVenue.address}</span>
                  </p>
                </div>

                {/* Modal Header Quick Action Buttons */}
                <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                  <button
                    onClick={() => toggleInterestedVenue(selectedVenue.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isInterested(selectedVenue.id)
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200'
                    }`}
                  >
                    <ThumbsUp className={`h-3.5 w-3.5 ${isInterested(selectedVenue.id) ? 'fill-current' : ''}`} />
                    <span>{isInterested(selectedVenue.id) ? 'Shortlisted ✓' : 'Interested'}</span>
                  </button>

                  <button
                    onClick={() => {
                      markNotInterestedVenue(selectedVenue.id);
                      setDetailsModalOpen(false);
                    }}
                    className="px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 border border-slate-200 transition-all"
                  >
                    <ThumbsDown className="h-3.5 w-3.5" />
                    <span>Not Interested</span>
                  </button>
                </div>
              </div>

              {/* Two Column Layout: Left (Images, Space, Amenities) | Right (About, Capacity, Pricing, Booking) */}
              <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                
                {/* LEFT COLUMN: Gallery + Space Details + Amenities */}
                <div className="lg:col-span-6 space-y-6">
                  
                  {/* Primary Photo with Next / Prev Controls */}
                  <div className="rounded-2xl overflow-hidden aspect-[16/10] bg-slate-900 border border-slate-200 relative group select-none">
                    <img 
                      src={selectedVenue.images[activeImageIndex] || selectedVenue.images[0]} 
                      alt={`${selectedVenue.title} - Photo ${activeImageIndex + 1}`}
                      className="w-full h-full object-cover transition-opacity duration-300"
                    />
                    <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-md text-xs font-bold text-slate-800 shadow-sm">
                      {selectedVenue.availability}
                    </div>

                    <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-semibold text-white shadow-sm flex items-center gap-1">
                      <Camera className="h-3 w-3 text-orange-400" />
                      <span>Photo {activeImageIndex + 1} of {selectedVenue.images.length}</span>
                    </div>

                    {/* Left / Right Photo Cycling */}
                    {selectedVenue.images.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : selectedVenue.images.length - 1));
                          }}
                          className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center transition-all opacity-80 hover:opacity-100 shadow-md"
                          aria-label="Previous photo"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveImageIndex((prev) => (prev < selectedVenue.images.length - 1 ? prev + 1 : 0));
                          }}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center transition-all opacity-80 hover:opacity-100 shadow-md"
                          aria-label="Next photo"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* 6-Photo Catalog Thumbnail Strip */}
                  {selectedVenue.images.length > 1 && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                          <Camera className="h-3.5 w-3.5 text-[#f58200]" />
                          <span>Venue Photo Catalog ({selectedVenue.images.length} Views)</span>
                        </span>
                        <span className="text-[11px] text-slate-400">Click photo to enlarge</span>
                      </div>
                      <div className="grid grid-cols-6 gap-1.5">
                        {selectedVenue.images.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveImageIndex(idx)}
                            className={`aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all ${
                              activeImageIndex === idx 
                                ? 'border-[#f58200] ring-2 ring-orange-200 scale-95 shadow-sm' 
                                : 'border-slate-200 opacity-70 hover:opacity-100'
                            }`}
                          >
                            <img src={img} alt={`Catalog View ${idx + 1}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Space Details */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70 space-y-2.5 text-xs">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                      Space Details
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-slate-700">
                      <div>
                        <span className="text-slate-400 block">Total Area</span>
                        <span className="font-semibold">{selectedVenue.spaceDetails.totalArea}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Stage</span>
                        <span className="font-semibold">{selectedVenue.spaceDetails.stage}</span>
                      </div>
                    </div>
                    <div className="pt-1 border-t border-slate-200/60">
                      <span className="text-slate-400 block">Parking</span>
                      <span className="font-semibold text-slate-700">{selectedVenue.spaceDetails.parking}</span>
                    </div>
                  </div>

                  {/* Amenities Grid */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                      Amenities & Facilities
                    </h4>
                    <div className="grid grid-cols-2 gap-2.5">
                      {selectedVenue.amenities.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200/80 text-xs text-slate-700">
                          <AmenityIcon icon={item.icon} />
                          <span className="font-medium truncate">{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* RIGHT COLUMN: Overview + Capacity + Pricing + Booking Card */}
                <div className="lg:col-span-6 space-y-6">
                  
                  {/* About the Venue */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                      About the Venue
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {selectedVenue.tagline}. This venue is fully verified and prepared for high-impact brand launches, technology keynotes, exhibitions, and university summits.
                    </p>
                  </div>

                  {/* Event Types / Suitable For */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                      Suitable Event Types
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedVenue.idealFor.map((event, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                          {event}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Capacity Breakdown */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                      Guest Capacity
                    </h4>
                    <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200/70 text-xs">
                      <div>
                        <span className="text-slate-400 block">Min Guests</span>
                        <strong className="text-slate-900">{selectedVenue.capacityDetails.minGuests}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Max Guests</span>
                        <strong className="text-slate-900">{selectedVenue.capacityDetails.maxGuests}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Seating Capacity</span>
                        <strong className="text-slate-900">{selectedVenue.capacityDetails.seatingCapacity} seats</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Standing Capacity</span>
                        <strong className="text-slate-900">{selectedVenue.capacityDetails.standingCapacity} pax</strong>
                      </div>
                    </div>
                  </div>

                  {/* 1. Promotional Banner: Book via HappyMoments & get 5% more discount */}
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-teal-500/10 border border-emerald-300 flex items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                        5%
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-black text-emerald-950 tracking-tight flex items-center gap-1.5">
                          <span>Book via HappyMoments & get 5% more discount</span>
                          <Sparkles className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        </div>
                        <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
                          Portal exclusive offer • Instant savings of ~₹{Math.round((selectedVenue.pricing.amount * 0.05)).toLocaleString('en-IN')} applied on booking
                        </p>
                      </div>
                    </div>
                    <span className="hidden sm:inline-block bg-emerald-600 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full tracking-wide shrink-0">
                      5% OFF
                    </span>
                  </div>

                  {/* 2. Vibrant Pricing Display */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/40 border border-emerald-200 shadow-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-emerald-800 uppercase tracking-wider font-bold">
                        Verified Pricing
                      </span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-200/80">
                        Price Guarantee
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <div className="text-2xl sm:text-3xl font-black text-emerald-600 tracking-tight">
                        {selectedVenue.pricing.displayPrice}
                      </div>
                      <span className="text-xs text-slate-500 font-medium">/ event slot</span>
                    </div>
                    <p className="text-[11px] text-slate-500 pt-0.5 leading-snug">
                      Transparent rates with HappyMoments price guarantee. Final quote includes AC, basic stage lighting & audio rack.
                    </p>
                  </div>

                  {/* 3. Dedicated Button: Booking Managed by HappyMoments */}
                  <button
                    type="button"
                    onClick={() => window.open(generateWhatsAppLink(selectedVenue.title), '_blank')}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold py-3.5 px-4 rounded-xl shadow-sm hover:shadow-md flex items-center justify-center gap-2 border border-slate-700 transition-all cursor-pointer group"
                  >
                    <ShieldCheck className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <span>Booking Managed by HappyMoments</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded-full border border-emerald-400/30">
                      Verified Safety
                    </span>
                  </button>

                  {/* Centralized HappyMoments Booking Card */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-orange-50/70 border border-orange-200 space-y-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src="/images/logo.jpg"
                        alt="HappyMoments HM Logo"
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-contain bg-white shadow-xs border border-orange-200 p-0.5 shrink-0"
                      />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">
                          Direct Executive Assistance
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Dedicated representative assigned to your booking enquiry
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      HappyMoments will help you connect with the venue and manage your booking enquiry directly with dedicated coordination.
                    </p>

                    <div className="text-xs text-slate-700 font-medium">
                      WhatsApp Us: <strong className="text-slate-900">{HAPPYMOMENTS_SUPPORT_PHONE}</strong>
                    </div>

                    {/* Shortlist status banner in booking card */}
                    {isInterested(selectedVenue.id) && (
                      <div className="bg-emerald-100/80 border border-emerald-300 text-emerald-800 text-xs px-3 py-2 rounded-xl flex items-center justify-between font-medium">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                          <span>Venue is saved in your <strong>Interested List</strong></span>
                        </div>
                        <button
                          onClick={() => toggleInterestedVenue(selectedVenue.id)}
                          className="text-[11px] text-red-600 hover:underline font-semibold"
                        >
                          Remove
                        </button>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      <a
                        href={generateWhatsAppLink(selectedVenue.title)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#25D366] hover:bg-[#20bd5a] text-white transition-colors shadow-xs"
                      >
                        <MessageCircle className="h-4 w-4 shrink-0" />
                        <span>Chat on WhatsApp</span>
                      </a>

                      <Button
                        onClick={() => {
                          if (selectedVenue) {
                            addInquiry({
                              spaceId: selectedVenue.id,
                              spaceTitle: selectedVenue.title,
                              spaceCategory: selectedVenue.categoryLabel,
                              spaceCity: selectedVenue.city,
                              pricing: selectedVenue.pricing.displayPrice,
                              eventDate: 'Flexible / Immediate Inquiry',
                              durationDays: 1,
                              expectedFootfall: selectedVenue.capacityDetails.minGuests,
                              requirements: `Inquiry for ${selectedVenue.title}`
                            });
                            window.open(generateWhatsAppLink(selectedVenue.title), '_blank');
                          }
                        }}
                        className="bg-[#f58200] hover:bg-[#e07500] text-white text-xs font-semibold rounded-xl py-2.5 flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Send className="h-3.5 w-3.5 shrink-0" />
                        <span>Send Inquiry</span>
                      </Button>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* 4. STREAMLINED INQUIRY FORM MODAL                                         */}
      {/* ========================================================================= */}
      <Dialog open={inquiryModalOpen} onOpenChange={setInquiryModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">
              Submit Inquiry for {selectedVenue?.title}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Our team will verify slot availability and deliver a formal quotation within 2 hours.
            </DialogDescription>
          </DialogHeader>

          {inquirySuccess ? (
            <div className="text-center py-6 space-y-2">
              <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
              <h4 className="font-bold text-slate-900 text-sm">Inquiry Sent Successfully</h4>
              <p className="text-xs text-slate-500">
                Tracking added to your "My Inquiries" dashboard tab.
              </p>
            </div>
          ) : (
            <form onSubmit={handleInquirySubmit} className="space-y-3.5 pt-2">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Planned Event Date</Label>
                <Input 
                  type="date" 
                  value={inquiryDate} 
                  onChange={(e) => setInquiryDate(e.target.value)} 
                  required 
                  className="text-xs rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">Duration (Days)</Label>
                  <Input 
                    type="number" 
                    min="1" 
                    value={inquiryDuration} 
                    onChange={(e) => setInquiryDuration(e.target.value)} 
                    required 
                    className="text-xs rounded-lg"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">Expected Guests</Label>
                  <Input 
                    type="number" 
                    value={inquiryFootfall} 
                    onChange={(e) => setInquiryFootfall(e.target.value)} 
                    required 
                    className="text-xs rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Notes / Setup Requirements</Label>
                <Textarea 
                  placeholder="Need LED backdrop, registration booth, specific stage size..." 
                  value={inquiryNotes} 
                  onChange={(e) => setInquiryNotes(e.target.value)} 
                  rows={3} 
                  className="text-xs rounded-lg"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-[#f58200] hover:bg-[#e07500] text-white text-xs font-semibold py-2.5 rounded-xl mt-2"
              >
                Send Inquiry to HappyMoments
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Talk with Executive Modal */}
      <Dialog open={talkExecutiveModalOpen} onOpenChange={setTalkExecutiveModalOpen}>
        <DialogContent className="w-[94vw] sm:max-w-md p-0 rounded-2xl sm:rounded-3xl border-slate-200 overflow-hidden bg-white text-slate-900 shadow-2xl">
          <div className="p-6 sm:p-7 space-y-5">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 text-emerald-600 shadow-xs">
                <PhoneCall className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                  Direct Booking Support
                </span>
                <DialogTitle className="text-xl font-black text-slate-900 mt-1.5">
                  Talk with Executive
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Directly contact our Senior Booking Coordinator to finalize venue contracts, schedule on-site walkthroughs, or clarify pricing and calendar availability.
                </DialogDescription>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-left space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-medium">Direct Coordinator Desk</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active Now
                </span>
              </div>
              <div className="text-xl font-black text-slate-900 tracking-tight">
                {HAPPYMOMENTS_SUPPORT_PHONE}
              </div>
              <p className="text-[11px] text-slate-500">
                Call or WhatsApp our executive to lock in your event date and receive expedited booking confirmations.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <a
                href={`tel:${HAPPYMOMENTS_SUPPORT_PHONE}`}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-all"
              >
                <Phone className="h-4 w-4 text-emerald-400" />
                <span>Call {HAPPYMOMENTS_SUPPORT_PHONE}</span>
              </a>

              <a
                href={`https://wa.me/${HAPPYMOMENTS_WHATSAPP_NUMBER}?text=Hi%20HappyMoments!%20%F0%9F%91%8B%0A%0AI%20am%20reviewing%20venues%20on%20the%20business%20dashboard%20and%20would%20like%20to%20talk%20with%20an%20Executive%20to%20finalize%20our%20booking.%0APlease%20connect%20with%20me.%20Thank%20you!`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-sm transition-all"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};

// =========================================================================
// SUB-COMPONENT: CLEAN EQUAL-HEIGHT VENUE CARD
// =========================================================================
interface VenueCardProps {
  venue: BusinessSpace;
  onOpenDetails: (venue: BusinessSpace) => void;
  isInterested: boolean;
  isNotInterested: boolean;
  onToggleInterested: (venueId: string) => void;
  onMarkNotInterested: (venueId: string) => void;
  onUndoNotInterested: (venueId: string) => void;
}

const VenueCard: React.FC<VenueCardProps> = ({ 
  venue, 
  onOpenDetails, 
  isInterested, 
  isNotInterested, 
  onToggleInterested, 
  onMarkNotInterested, 
  onUndoNotInterested 
}) => {
  // If user marked this venue as Not Interested, show clean collapsed placeholder with Undo
  if (isNotInterested) {
    return (
      <div className="bg-slate-50/90 rounded-2xl border border-dashed border-slate-300 p-4 flex flex-col justify-between h-full text-center transition-all min-h-[220px]">
        <div className="flex-1 flex flex-col items-center justify-center space-y-2 py-4">
          <div className="w-10 h-10 rounded-full bg-slate-200/80 flex items-center justify-center text-slate-400">
            <ThumbsDown className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-700 line-clamp-1">{venue.title}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Marked as Not Interested</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onUndoNotInterested(venue.id)}
          className="text-xs font-semibold text-[#f58200] hover:text-[#e07500] hover:bg-orange-50 h-8 flex items-center justify-center gap-1.5 w-full rounded-xl"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Restore Venue</span>
        </Button>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl border overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col h-full ${
      isInterested ? 'border-emerald-400/80 ring-1 ring-emerald-300/60' : 'border-slate-200 hover:border-slate-300'
    }`}>
      
      {/* 1. Venue Image & Catalog Badge */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 group">
        <img 
          src={venue.images[0]} 
          alt={venue.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        {/* 2. Venue Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="text-[11px] font-bold uppercase tracking-wider bg-white/95 backdrop-blur-sm text-slate-800 px-2.5 py-1 rounded-md shadow-xs">
            {venue.categoryLabel}
          </span>
        </div>

        {/* Catalog Photos Count Badge */}
        <div className="absolute top-3 right-3">
          <span className="text-[10px] sm:text-[11px] font-semibold bg-black/65 backdrop-blur-md text-white px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
            <Camera className="h-3 w-3 text-orange-300" />
            <span>{venue.images.length} Photos</span>
          </span>
        </div>

        {/* Shortlisted Ribbon */}
        {isInterested && (
          <div className="absolute bottom-3 right-3 bg-emerald-600 text-white text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
            <Check className="h-3 w-3 stroke-[3]" />
            <span>Shortlisted</span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3.5">
        
        <div className="space-y-2">
          {/* 3. Venue Name */}
          <h3 className="text-base font-bold text-slate-900 line-clamp-1 group-hover:text-[#f58200] transition-colors">
            {venue.title}
          </h3>

          {/* 4. Location */}
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{venue.locality}, {venue.city}</span>
          </p>

          {/* 5. Capacity / Seats */}
          <p className="text-xs text-slate-700 flex items-center gap-1 font-medium">
            <Users className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span>{venue.capacity}</span>
          </p>

          {/* 6. Starting Price with Vibrant Color & 5% Discount Badge */}
          <div className="pt-0.5 space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-1">
                <span className="text-[11px] font-semibold text-slate-500">From</span>
                <span className="text-base font-black text-emerald-600 tracking-tight">
                  ₹{venue.pricing.amount.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">/ day</span>
              </div>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                <Sparkles className="h-2.5 w-2.5 text-emerald-600" />
                <span>5% OFF</span>
              </span>
            </div>

            {/* Booking Managed by HappyMoments Pill */}
            <div className="flex items-center gap-1 text-[10.5px] text-slate-600 font-medium">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">Booking Managed by HappyMoments</span>
            </div>
          </div>

          {/* 7. Availability */}
          <p className="text-[11.5px] text-emerald-700 font-medium">
            {venue.availability}
          </p>
        </div>

        {/* Action Buttons: View Details + Interested / Not Interested */}
        <div className="pt-2 space-y-2">
          {/* View Details Button */}
          <Button
            onClick={() => onOpenDetails(venue)}
            variant="outline"
            className="w-full border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-800 text-xs font-semibold rounded-xl py-2 flex items-center justify-center gap-1.5 transition-colors h-9"
          >
            <Eye className="h-3.5 w-3.5 text-[#f58200]" />
            <span>View Details</span>
          </Button>

          {/* Interested & Not Interested Toggle Row */}
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => onToggleInterested(venue.id)}
              className={`py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all h-8.5 ${
                isInterested
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200/60'
              }`}
              title={isInterested ? 'Remove from Interested List' : 'Mark as Interested'}
            >
              <ThumbsUp className={`h-3 w-3 ${isInterested ? 'fill-current' : ''}`} />
              <span>{isInterested ? 'Interested ✓' : 'Interested'}</span>
            </button>

            <button
              onClick={() => onMarkNotInterested(venue.id)}
              className="py-1.5 px-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1 bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 border border-slate-200/60 transition-all h-8.5"
              title="Hide this venue"
            >
              <ThumbsDown className="h-3 w-3" />
              <span>Not Interested</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

// Sub-component for amenity icon rendering
const AmenityIcon: React.FC<{ icon: string }> = ({ icon }) => {
  const props = { className: "h-3.5 w-3.5 text-[#f58200] shrink-0" };
  switch (icon) {
    case 'Tv': return <Tv {...props} />;
    case 'Volume2': return <Volume2 {...props} />;
    case 'Wifi': return <Wifi {...props} />;
    case 'Mic': return <Mic {...props} />;
    case 'Wind': return <Wind {...props} />;
    case 'Car': return <Car {...props} />;
    case 'Utensils': return <Utensils {...props} />;
    case 'Zap': return <Zap {...props} />;
    case 'DoorClosed': return <DoorClosed {...props} />;
    case 'Camera': return <Camera {...props} />;
    default: return <Sparkles {...props} />;
  }
};

export default BusinessDashboard;
