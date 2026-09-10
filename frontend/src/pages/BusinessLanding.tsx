import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useBusinessAuth } from '@/contexts/BusinessAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Building2, 
  MapPin, 
  ArrowRight, 
  Check, 
  Eye, 
  EyeOff, 
  Menu, 
  X, 
  TrendingUp, 
  Handshake,
  PhoneCall,
  Phone,
  MessageCircle,
  ShieldCheck,
  LayoutGrid,
  Sparkles,
  Store,
  ShoppingBag,
  Megaphone,
  Tv,
  CheckCircle2
} from 'lucide-react';
import { BUSINESS_SPACES, HAPPYMOMENTS_SUPPORT_PHONE, HAPPYMOMENTS_WHATSAPP_NUMBER } from '@/data/businessSpacesData';

const BusinessLanding: React.FC = () => {
  const navigate = useNavigate();
  const { businessOwner, signIn, signUp } = useBusinessAuth();

  // Navigation mobile state
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Executive Contact & Onboarding Modals
  const [talkExecutiveModalOpen, setTalkExecutiveModalOpen] = useState(false);
  const [venueOnboardingModalOpen, setVenueOnboardingModalOpen] = useState(false);

  // WhatsApp Pre-filled Links
  const whatsappExecutiveLink = "https://wa.me/917330732710?text=" + encodeURIComponent(
    "Hi HappyMoments! 👋\n\nI would like to talk with a venue executive to finalize our event venue booking details.\n\nPlease share immediate availability and package details.\n\nThank you!"
  );

  const whatsappOnboardingLink = "https://wa.me/917330732710?text=" + encodeURIComponent(
    "Hi HappyMoments! 👋\n\nI am a venue owner and would like to register/list my venue on HappyMoments Business.\n\nPlease guide me through the manual safety verification and onboarding process.\n\nThank you!"
  );

  // Auth Modal state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');
  
  // Login Form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Signup Form state
  const [signupData, setSignupData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    mobileNumber: '',
    businessType: 'Retail / D2C Brand' as any,
    city: 'Hyderabad',
    websiteUrl: '',
    password: '',
    confirmPassword: ''
  });
  const [signupError, setSignupError] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  // Category filter for preview section
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Handle Quick Demo Login
  const handleDemoLogin = async () => {
    setLoginLoading(true);
    setLoginError('');
    const res = await signIn('business@spotlight.com', 'Business@123');
    setLoginLoading(false);
    if (res.success) {
      setAuthModalOpen(false);
      navigate('/business-dashboard');
    } else {
      setLoginError(res.error || 'Demo login failed');
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError('Please enter both email and password');
      return;
    }
    setLoginLoading(true);
    setLoginError('');
    const res = await signIn(loginEmail.trim(), loginPassword);
    setLoginLoading(false);
    if (res.success) {
      setAuthModalOpen(false);
      navigate('/business-dashboard');
    } else {
      setLoginError(res.error || 'Invalid credentials');
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');

    const cleanPhone = signupData.mobileNumber.replace(/\D/g, '');
    if (!signupData.fullName.trim() || !signupData.companyName.trim() || !signupData.email.trim() || !signupData.mobileNumber.trim()) {
      setSignupError('Please fill in all required fields');
      return;
    }
    if (cleanPhone.length < 10) {
      setSignupError('Mobile / WhatsApp phone number is mandatory (minimum 10 digits required).');
      return;
    }
    if (signupData.password.length < 6) {
      setSignupError('Password must be at least 6 characters');
      return;
    }
    if (signupData.password !== signupData.confirmPassword) {
      setSignupError('Passwords do not match');
      return;
    }

    setSignupLoading(true);
    const res = await signUp({
      fullName: signupData.fullName.trim(),
      companyName: signupData.companyName.trim(),
      email: signupData.email.trim(),
      mobileNumber: signupData.mobileNumber.trim(),
      businessType: signupData.businessType,
      city: signupData.city,
      websiteUrl: signupData.websiteUrl.trim(),
      password: signupData.password
    });
    setSignupLoading(false);

    if (res.success) {
      setAuthModalOpen(false);
      navigate('/business-dashboard');
    } else {
      setSignupError(res.error || 'Registration failed');
    }
  };

  const openAuth = (tab: 'login' | 'signup') => {
    setAuthTab(tab);
    setLoginError('');
    setSignupError('');
    setAuthModalOpen(true);
  };

  // Filtered preview spaces for Square Grids Sections
  const previewSpaces = useMemo(() => {
    if (activeCategory === 'all') return BUSINESS_SPACES.slice(0, 6);
    if (activeCategory === 'product_launch') {
      return BUSINESS_SPACES.filter(s => s.category === 'product_launch' || s.idealFor.some(i => i.toLowerCase().includes('launch'))).slice(0, 6);
    }
    if (activeCategory === 'stall_booking') {
      return BUSINESS_SPACES.filter(s => s.idealFor.some(i => i.toLowerCase().includes('stall') || i.toLowerCase().includes('exhibition') || i.toLowerCase().includes('pop')) || s.title.toLowerCase().includes('expo')).slice(0, 6);
    }
    if (activeCategory === 'corporate_summit') {
      return BUSINESS_SPACES.filter(s => s.idealFor.some(i => i.toLowerCase().includes('summit') || i.toLowerCase().includes('conference') || i.toLowerCase().includes('corporate'))).slice(0, 6);
    }
    if (activeCategory === 'brand_activation') {
      return BUSINESS_SPACES.filter(s => s.idealFor.some(i => i.toLowerCase().includes('brand') || i.toLowerCase().includes('activation') || i.toLowerCase().includes('creator')) || s.category === 'college_space').slice(0, 6);
    }
    return BUSINESS_SPACES.slice(0, 6);
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-orange-100 selection:text-orange-900">
      
      {/* ========================================================================= */}
      {/* 1. CLEAN HEADER                                                           */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <Link to="/business" className="flex items-center gap-2.5 group">
              <img
                src="/images/logo.jpg"
                alt="HappyMoments Logo"
                className="w-9 h-9 sm:w-10 sm:h-10 object-contain rounded-lg shadow-xs"
              />
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                  Happy<span className="text-[#f58200]">Moments</span>
                </span>
                <span className="text-slate-300 font-light text-base sm:text-xl">|</span>
                <span className="text-[10px] sm:text-xs font-bold tracking-wider uppercase bg-slate-900 text-white px-2 py-0.5 rounded">
                  Business
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#venues-preview" className="hover:text-[#f58200] transition-colors">
              Find Venues
            </a>
            <a href="#how-it-works" className="hover:text-[#f58200] transition-colors">
              How It Works
            </a>
            <a href="#for-venue-owners" className="hover:text-[#f58200] transition-colors">
              For Venue Owners
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Talk with Executive Button */}
            <button
              onClick={() => setTalkExecutiveModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 transition-all shadow-xs"
              title="Directly Call or WhatsApp Executive to Finalize"
            >
              <PhoneCall className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span>Talk with Executive</span>
            </button>

            {businessOwner ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-600">
                  Hi, <strong className="text-slate-900">{businessOwner.companyName}</strong>
                </span>
                <Button 
                  onClick={() => navigate('/business-dashboard')}
                  className="bg-[#f58200] hover:bg-[#e07500] text-white font-medium rounded-lg text-sm px-4 py-2"
                >
                  Dashboard →
                </Button>
              </div>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => openAuth('login')}
                  className="text-slate-700 hover:text-slate-900 hover:bg-slate-100 font-medium text-sm"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => setVenueOnboardingModalOpen(true)}
                  className="bg-[#f58200] hover:bg-[#e07500] text-white font-medium text-sm rounded-lg px-4 py-2 shadow-sm transition"
                >
                  Register Your Venue
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="text-slate-700"
              aria-label="Toggle navigation"
            >
              {mobileNavOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileNavOpen && (
          <div className="md:hidden border-b border-slate-100 bg-white px-4 pt-2 pb-6 space-y-3">
            <a 
              href="#venues-preview" 
              onClick={() => setMobileNavOpen(false)}
              className="block py-2 text-base font-medium text-slate-700 hover:text-[#f58200]"
            >
              Find Venues
            </a>
            <a 
              href="#how-it-works" 
              onClick={() => setMobileNavOpen(false)}
              className="block py-2 text-base font-medium text-slate-700 hover:text-[#f58200]"
            >
              How It Works
            </a>
            <a 
              href="#for-venue-owners" 
              onClick={() => setMobileNavOpen(false)}
              className="block py-2 text-base font-medium text-slate-700 hover:text-[#f58200]"
            >
              For Venue Owners
            </a>

            {/* Mobile Talk with Executive Button */}
            <button
              onClick={() => { setMobileNavOpen(false); setTalkExecutiveModalOpen(true); }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 transition-all shadow-xs"
            >
              <PhoneCall className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Talk with Executive</span>
            </button>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              {businessOwner ? (
                <Button 
                  onClick={() => { setMobileNavOpen(false); navigate('/business-dashboard'); }}
                  className="w-full bg-[#f58200] hover:bg-[#e07500] text-white"
                >
                  Go to Dashboard →
                </Button>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => { setMobileNavOpen(false); openAuth('login'); }}
                    className="w-full justify-center text-slate-800"
                  >
                    Sign In
                  </Button>
                  <Button 
                    onClick={() => { setMobileNavOpen(false); setVenueOnboardingModalOpen(true); }}
                    className="w-full justify-center bg-[#f58200] hover:bg-[#e07500] text-white font-medium"
                  >
                    Register Your Venue
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION (Clean 2-Column Layout)                                    */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Copy & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Tagline */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200/60 text-xs font-semibold uppercase tracking-wider text-[#f58200]">
                <span>Find. Connect. Launch.</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                Find the Perfect Venue for Your Event
              </h1>

              {/* Subheading */}
              <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-xl">
                Discover and connect with verified venues for product launches, exhibitions, corporate events, workshops and more.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Button 
                  onClick={() => navigate('/business-dashboard')}
                  size="lg"
                  className="bg-[#f58200] hover:bg-[#e07500] text-white font-semibold text-base px-8 py-6 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Explore Venues</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  onClick={() => setVenueOnboardingModalOpen(true)}
                  size="lg"
                  variant="outline"
                  className="bg-white border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold text-base px-8 py-6 rounded-xl transition-all"
                >
                  List Your Venue
                </Button>
              </div>

            </div>

            {/* Right Column: High-Quality Venue Image */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-100 group">
                <img 
                  src="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80" 
                  alt="High-end auditorium venue for product launches and corporate summits"
                  className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white">
                    <span className="text-xs font-semibold uppercase tracking-wider bg-[#f58200] px-2.5 py-1 rounded text-white inline-block mb-1">
                      Featured Space
                    </span>
                    <h2 className="text-lg font-bold leading-snug">HICC Grand Ballroom & Arena</h2>
                    <p className="text-xs text-slate-200">HITEC City, Hyderabad • 2,500 Capacity</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. QUICK STATS                                                            */}
      {/* ========================================================================= */}
      <section className="py-10 sm:py-12 bg-slate-50/70 border-y border-slate-200/60">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 sm:gap-8 text-center divide-x divide-slate-200/80">
            
            {/* Stat 1 */}
            <div className="px-2 sm:px-4">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-[#f58200]" />
                <span className="text-2xl sm:text-4xl font-black text-slate-900">50+</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-600">Verified Venues</p>
            </div>

            {/* Stat 2 */}
            <div className="px-2 sm:px-4">
              <div className="flex items-center justify-center gap-2 mb-1">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-[#f58200]" />
                <span className="text-2xl sm:text-4xl font-black text-slate-900">35,000+</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-600">Daily Footfall</p>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. FIND VENUES / CURATED PREVIEW                                          */}
      {/* ========================================================================= */}
      <section id="venues-preview" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#f58200]">
                Explore Catalog
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-1">
                Curated Spaces for Every Format
              </h2>
              <p className="text-slate-600 text-base mt-2 max-w-2xl">
                Auditoriums for high-impact launches, high-footfall mall atriums, and tech park exhibition stalls.
              </p>
            </div>
            <Button 
              onClick={() => navigate('/business-dashboard')}
              variant="outline"
              className="border-slate-300 text-slate-800 hover:bg-slate-50 font-medium self-start md:self-end"
            >
              View All in Dashboard →
            </Button>
          </div>

          {/* Square Grids Sections Model with Mini Images */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4.5 mb-10">
            {[
              { 
                id: 'all', 
                label: 'All Spaces', 
                tagline: '50+ Venues',
                detail: 'Auditoriums & Stalls',
                image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=400&q=80',
                icon: LayoutGrid,
                color: 'text-amber-500',
                bgLight: 'bg-amber-50'
              },
              { 
                id: 'product_launch', 
                label: 'Product Launches', 
                tagline: 'Keynotes & Reveals',
                detail: 'Concert Sound & 4K LED',
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
            ].map(cat => {
              const Icon = cat.icon;
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    navigate(`/business-dashboard?category=${cat.id}`);
                  }}
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

                  {/* Top: Mini Image Thumbnail with Gradient Overlay & Category Icon Badge */}
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

                  {/* Bottom: Label & Format Detail */}
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

          {/* Venue Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {previewSpaces.map((space) => (
              <div 
                key={space.id}
                className="group rounded-2xl border border-slate-200 overflow-hidden bg-white hover:border-slate-300 hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img 
                    src={space.images[0]} 
                    alt={space.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-[11px] font-semibold uppercase tracking-wider bg-white/95 backdrop-blur-sm text-slate-800 px-2.5 py-1 rounded-md shadow-sm">
                      {space.categoryLabel}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#f58200] transition-colors line-clamp-1">
                      {space.title}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      {space.locality}, {space.city}
                    </p>
                    <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                      {space.tagline}
                    </p>
                  </div>

                  {/* Pricing and Action */}
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">From</span>
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-1.5 py-0.2 rounded">5% OFF</span>
                      </div>
                      <span className="text-base sm:text-lg font-black text-emerald-600 tracking-tight">
                        ₹{space.pricing.amount.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium ml-1">/ day</span>
                    </div>
                    <Button
                      onClick={() => navigate('/business-dashboard')}
                      size="sm"
                      className="bg-slate-900 hover:bg-[#f58200] text-white text-xs font-semibold rounded-xl transition-colors px-3.5 py-2 shadow-xs"
                    >
                      View Space →
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Link to Dashboard */}
          <div className="text-center mt-12">
            <Button 
              onClick={() => navigate('/business-dashboard')}
              size="lg"
              className="bg-[#f58200] hover:bg-[#e07500] text-white font-semibold px-8 py-6 rounded-xl shadow-sm hover:shadow transition"
            >
              Explore All 50+ Venues in Dashboard →
            </Button>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. HOW IT WORKS                                                           */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="py-20 bg-slate-50/70 border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#f58200]">
              Simple & Transparent
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-1">
              How It Works
            </h2>
            <p className="text-slate-600 text-base mt-2">
              Three straightforward steps to secure your event space with zero friction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm relative">
              <span className="w-10 h-10 rounded-xl bg-orange-50 text-[#f58200] font-black text-lg flex items-center justify-center mb-6">
                1
              </span>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Find a Venue</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Browse venues based on your event requirements. Filter by capacity, city, footfall, and tech specs.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm relative">
              <span className="w-10 h-10 rounded-xl bg-orange-50 text-[#f58200] font-black text-lg flex items-center justify-center mb-6">
                2
              </span>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Connect Directly</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Contact venue managers directly via WhatsApp or send instant customized inquiry briefs.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm relative">
              <span className="w-10 h-10 rounded-xl bg-orange-50 text-[#f58200] font-black text-lg flex items-center justify-center mb-6">
                3
              </span>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Book Your Event</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Finalize the venue and launch your event. Schedule recce visits and lock in approved commercial slots.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. FOR VENUE OWNERS (Callout Section)                                      */}
      {/* ========================================================================= */}
      <section id="for-venue-owners" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
            <div className="max-w-2xl relative z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-[#f58200] bg-orange-500/10 px-3 py-1 rounded-full inline-block mb-3">
                Venue Partnerships
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Own a Premier Venue or Commercial Space?
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mt-3">
                Join India's curated B2B venue network. Connect directly with corporate event organizers, retail brands, and tech companies.
              </p>
              <div className="pt-6 flex flex-wrap gap-4">
                <Button 
                  onClick={() => setVenueOnboardingModalOpen(true)}
                  size="lg"
                  className="bg-[#f58200] hover:bg-[#e07500] text-white font-semibold rounded-xl text-sm px-6 py-5"
                >
                  Register Your Venue Today →
                </Button>
                <Button 
                  onClick={() => openAuth('login')}
                  variant="outline"
                  size="lg"
                  className="bg-transparent border-slate-700 text-white hover:bg-slate-800 rounded-xl text-sm px-6 py-5"
                >
                  Owner Sign In
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. CLEAN MINIMAL FOOTER                                                    */}
      {/* ========================================================================= */}
      <footer className="bg-white border-t border-slate-200/80 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <img
              src="/images/logo.jpg"
              alt="HappyMoments HM Logo"
              className="w-7 h-7 object-contain rounded-md"
            />
            <span className="text-lg font-black text-slate-900">
              Happy<span className="text-[#f58200]">Moments</span>
            </span>
            <span className="text-slate-300 font-light text-base">|</span>
            <span className="text-xs font-bold tracking-wider uppercase text-slate-500">
              Business
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600">
            <a href="#venues-preview" className="hover:text-slate-900">Find Venues</a>
            <a href="#how-it-works" className="hover:text-slate-900">How It Works</a>
            <a href="#for-venue-owners" className="hover:text-slate-900">For Venue Owners</a>
            <Link to="/" className="text-[#f58200] hover:underline font-medium">
              Switch to Consumer Portal →
            </Link>
          </div>

          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} HappyMoments. All rights reserved.
          </p>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* 8. TABBED AUTH MODAL (Login & Register with Demo Account)                 */}
      {/* ========================================================================= */}
      <Dialog open={authModalOpen} onOpenChange={setAuthModalOpen}>
        <DialogContent className="w-[94vw] sm:max-w-md max-h-[90vh] overflow-y-auto p-0 rounded-2xl border-slate-200">
          <div className="p-5 sm:p-6">
            
            {/* Modal Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 mb-2">
                <img
                  src="/images/logo.jpg"
                  alt="HappyMoments HM Logo"
                  className="w-7 h-7 object-contain rounded-lg shadow-xs"
                />
                <span className="font-extrabold text-xl text-slate-900">Happy<span className="text-[#f58200]">Moments</span></span>
                <span className="text-slate-300 mx-1">|</span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Business</span>
              </div>
              <DialogTitle className="text-xl font-bold text-slate-900">
                {authTab === 'login' ? 'Business Owner Sign In' : 'Register Your Venue or Business'}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 mt-1">
                {authTab === 'login' 
                  ? 'Access your corporate booking dashboard and quotes'
                  : 'Join as a venue owner or corporate event organizer'}
              </DialogDescription>
            </div>

            {/* Tab Selector */}
            <div className="grid grid-cols-2 bg-slate-100 p-1 rounded-xl mb-6 text-sm font-medium">
              <button
                type="button"
                onClick={() => { setAuthTab('login'); setLoginError(''); }}
                className={`py-2 rounded-lg transition-all ${
                  authTab === 'login' 
                    ? 'bg-white text-slate-900 shadow-sm font-semibold' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setAuthTab('signup'); setSignupError(''); }}
                className={`py-2 rounded-lg transition-all ${
                  authTab === 'signup' 
                    ? 'bg-white text-slate-900 shadow-sm font-semibold' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Register
              </button>
            </div>

            {/* Quick Demo Bypass */}
            {authTab === 'login' && (
              <div className="mb-6 p-4 rounded-xl bg-orange-50/70 border border-orange-200/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#f58200] uppercase tracking-wider">
                    Instant Demo Access
                  </span>
                  <span className="text-[11px] text-slate-500">Aura Innovations</span>
                </div>
                <Button
                  type="button"
                  onClick={handleDemoLogin}
                  disabled={loginLoading}
                  className="w-full bg-[#f58200] hover:bg-[#e07500] text-white font-medium text-xs py-2 rounded-lg"
                >
                  {loginLoading ? 'Signing in...' : '⚡ Quick Demo Login (business@spotlight.com)'}
                </Button>
              </div>
            )}

            {/* LOGIN FORM */}
            {authTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {loginError && (
                  <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
                    {loginError}
                  </div>
                )}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Business Email</Label>
                  <Input 
                    type="email" 
                    placeholder="name@company.com" 
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    className="text-sm rounded-lg"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Password</Label>
                  <div className="relative">
                    <Input 
                      type={showLoginPassword ? 'text' : 'password'}
                      placeholder="••••••••" 
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      className="text-sm rounded-lg pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={loginLoading}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-lg text-sm transition"
                >
                  {loginLoading ? 'Signing in...' : 'Sign In to Dashboard'}
                </Button>
              </form>
            )}

            {/* SIGNUP FORM */}
            {authTab === 'signup' && (
              <form onSubmit={handleSignupSubmit} className="space-y-3.5">
                {signupError && (
                  <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
                    {signupError}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-slate-700">Contact Person</Label>
                    <Input 
                      placeholder="e.g. Rahul Sharma"
                      value={signupData.fullName}
                      onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                      required
                      className="text-xs rounded-lg"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-slate-700">Company / Brand</Label>
                    <Input 
                      placeholder="e.g. Acme Tech"
                      value={signupData.companyName}
                      onChange={(e) => setSignupData({ ...signupData, companyName: e.target.value })}
                      required
                      className="text-xs rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-slate-700">Business Email</Label>
                    <Input 
                      type="email"
                      placeholder="contact@brand.com"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      required
                      className="text-xs rounded-lg"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-slate-800 flex items-center justify-between">
                      <span>WhatsApp Phone *</span>
                      <span className="text-[10px] text-orange-600 font-bold uppercase tracking-wider">(Mandatory)</span>
                    </Label>
                    <Input 
                      placeholder="10-digit mobile number"
                      value={signupData.mobileNumber}
                      onChange={(e) => setSignupData({ ...signupData, mobileNumber: e.target.value })}
                      required
                      className="text-xs rounded-lg"
                    />
                    <p className="text-[10px] text-slate-400">Required for account security & verification</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-slate-700">Business Type</Label>
                    <Select 
                      value={signupData.businessType} 
                      onValueChange={(val) => setSignupData({ ...signupData, businessType: val as any })}
                    >
                      <SelectTrigger className="text-xs rounded-lg">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Retail / D2C Brand">Retail / D2C Brand</SelectItem>
                        <SelectItem value="Tech Startup">Tech Startup</SelectItem>
                        <SelectItem value="Corporate / Enterprise">Corporate / Enterprise</SelectItem>
                        <SelectItem value="Exhibition Organizer">Exhibition Organizer</SelectItem>
                        <SelectItem value="F&B Brand">F&B Brand</SelectItem>
                        <SelectItem value="Artisan / Pop-up Vendor">Artisan / Pop-up Vendor</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-slate-700">City</Label>
                    <Input 
                      placeholder="e.g. Hyderabad"
                      value={signupData.city}
                      onChange={(e) => setSignupData({ ...signupData, city: e.target.value })}
                      required
                      className="text-xs rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-slate-700">Password</Label>
                    <Input 
                      type={showSignupPassword ? 'text' : 'password'}
                      placeholder="Min 6 chars"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      required
                      className="text-xs rounded-lg"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-slate-700">Confirm Password</Label>
                    <Input 
                      type={showSignupPassword ? 'text' : 'password'}
                      placeholder="Repeat password"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                      required
                      className="text-xs rounded-lg"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={signupLoading}
                  className="w-full bg-[#f58200] hover:bg-[#e07500] text-white font-semibold py-2.5 rounded-lg text-sm mt-2 transition"
                >
                  {signupLoading ? 'Registering...' : 'Create Business Account'}
                </Button>
              </form>
            )}

          </div>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* 9. TALK WITH EXECUTIVE MODAL                                              */}
      {/* ========================================================================= */}
      <Dialog open={talkExecutiveModalOpen} onOpenChange={setTalkExecutiveModalOpen}>
        <DialogContent className="w-[94vw] sm:max-w-md p-0 rounded-2xl sm:rounded-3xl border-slate-200 overflow-hidden">
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600 shadow-xs">
              <PhoneCall className="h-7 w-7" />
            </div>

            <div className="space-y-1.5">
              <DialogTitle className="text-xl font-bold text-slate-900">
                Talk with Venue Executive
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                Connect directly with a HappyMoments venue specialist to check live slot availability, negotiate package pricing, or finalize your reservation.
              </DialogDescription>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-left space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Dedicated Booking Helpline</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active
                </span>
              </div>
              <div className="text-lg font-black text-slate-900 tracking-tight">
                +91 7330732710
              </div>
              <p className="text-[11px] text-slate-500">
                Call or WhatsApp anytime. Instant response for corporate launches and campus formats.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <a
                href="tel:+917330732710"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-all"
              >
                <Phone className="h-4 w-4" />
                <span>Call +91 7330732710</span>
              </a>

              <a
                href={whatsappExecutiveLink}
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

      {/* ========================================================================= */}
      {/* 10. MANUAL VENUE ONBOARDING FOR SAFETY MODAL                              */}
      {/* ========================================================================= */}
      <Dialog open={venueOnboardingModalOpen} onOpenChange={setVenueOnboardingModalOpen}>
        <DialogContent className="w-[94vw] sm:max-w-lg p-0 rounded-2xl sm:rounded-3xl border-slate-200 overflow-hidden">
          <div className="p-6 sm:p-7 space-y-5">
            
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center shrink-0 text-[#f58200]">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#f58200] bg-orange-50 px-2.5 py-0.5 rounded-md">
                  Safety First • Manual Verification
                </span>
                <DialogTitle className="text-xl font-extrabold text-slate-900 mt-1.5">
                  Register Your Venue with HappyMoments
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-600 mt-1 leading-relaxed">
                  For safety standards, fire clearance validation, and acoustic verification, all venue onboarding is handled manually by our dedicated operations team.
                </DialogDescription>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3 text-xs text-slate-700">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                How Manual Venue Onboarding Works
              </h4>
              <div className="space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <strong className="text-slate-900 block">Connect with Onboarding Specialist</strong>
                    <span className="text-slate-500">Share property floor plans, photos, stage specs, and commercial rates.</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <strong className="text-slate-900 block">In-Person Technical & Safety Inspection</strong>
                    <span className="text-slate-500">Our safety officers inspect emergency exits, electrical loads, and acoustic isolation.</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <strong className="text-slate-900 block">Direct Access to Verified Event Organizers</strong>
                    <span className="text-slate-500">Your verified listing goes live on HappyMoments Business with direct booking inquiries.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2.5 pt-1">
              <div className="text-xs font-semibold text-slate-800 text-center">
                Contact our Venue Onboarding Desk directly:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href="tel:+917330732710"
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-all"
                >
                  <Phone className="h-4 w-4" />
                  <span>Call +91 7330732710</span>
                </a>

                <a
                  href={whatsappOnboardingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-sm transition-all"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>

          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default BusinessLanding;
