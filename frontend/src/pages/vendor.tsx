import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { Vendor } from '@/lib/supabase';
import { getVendorByFieldId, getVendorMedia, getHighlightedCatalogImages, getAllCatalogImages, getCustomerReviews } from '../services/supabaseService';
import { getVendorBrandLogoFromStorage, getVendorContactPersonImageFromStorage } from '../services/supabaseStorageService';
import { Star, MapPin, Phone, Mail, Instagram, Facebook, Heart, Share2, Calendar, Clock, CheckCircle, Camera, Video, Users, Award, MessageCircle, Zap, Trophy, Sparkles, ArrowRight, Play, Pause, Building2, Info, Globe, Scroll, FileText, Menu, X, ChevronLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import LikeButton from '@/components/LikeButton';
import WhatsAppButton from '@/components/WhatsAppButton';
import VendorStatusDropdown from '@/components/VendorStatusDropdown';
import VendorActionButtons from '@/components/VendorActionButtons';
import { useCustomerAuth } from '@/contexts/CustomerAuthContext';
import { checkVendorContacted, saveContactVendor, updateVendorStatus } from '@/services/contactedVendorsApiService';
import { getLoggedInVendor } from '@/services/supabaseService';
import AddReviewModal from '../components/AddReviewModal';

const VendorProfile = () => {
  const { vendorId } = useParams<{ vendorId: string }>();
  const { customer } = useCustomerAuth();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Check if customer is logged in - redirect to login if not
  // But skip if vendor is logged in (vendor should be able to view their own profile)
  // Only check after initial load is complete
  useEffect(() => {
    // Wait a bit for customer auth to initialize, then check
    const checkAuth = setTimeout(() => {
      const loggedInVendor = getLoggedInVendor();
      // If vendor is logged in, allow access without customer login
      if (!customer && !loggedInVendor && !isLoading && vendorId) {
        // Redirect to login with redirect parameter
        navigate(`/customer-login?redirect=${encodeURIComponent(`/vendor/${vendorId}`)}`);
      }
    }, 500);
    
    return () => clearTimeout(checkAuth);
  }, [customer, isLoading, navigate, vendorId]);
  const [contactStatus, setContactStatus] = useState<string>('Contacted');
  
  // Visit scheduling modal states
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [visitForm, setVisitForm] = useState({
    name: '',
    phone: '',
    eventType: 'Wedding',
    eventDate: '',
    venueLocation: '',
    visitDate: '',
    visitTimeSlot: 'Morning (10 AM - 12 PM)',
    notes: ''
  });
  const [isSubmittingVisit, setIsSubmittingVisit] = useState(false);
  const [visitSuccess, setVisitSuccess] = useState(false);

  // Instant Quote estimator states
  const [quoteForm, setQuoteForm] = useState({
    eventType: 'Wedding',
    guestCount: '100-200',
    budgetRange: 'Mid-range',
    eventDate: '',
    location: ''
  });
  const [quoteEstimate, setQuoteEstimate] = useState<{ min: number; max: number } | null>(null);
  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);
  const [quoteSuccess, setQuoteSuccess] = useState(false);

  // Prefill visit form when customer data is available
  useEffect(() => {
    if (customer) {
      setVisitForm(prev => ({
        ...prev,
        name: customer.full_name || '',
        phone: customer.mobile_number || ''
      }));
    }
  }, [customer]);

  // Cost estimation logic based on starting price, guest count, and service tier/budget range
  const calculateEstimate = useCallback(() => {
    const basePrice = vendor?.starting_price || 25000;
    
    let guestMultiplier = 1.0;
    switch (quoteForm.guestCount) {
      case '<100': guestMultiplier = 0.8; break;
      case '100-200': guestMultiplier = 1.0; break;
      case '200-500': guestMultiplier = 1.4; break;
      case '>500': guestMultiplier = 1.8; break;
    }

    let budgetMultiplier = 1.0;
    switch (quoteForm.budgetRange) {
      case 'Economy': budgetMultiplier = 0.7; break;
      case 'Mid-range': budgetMultiplier = 1.0; break;
      case 'Premium': budgetMultiplier = 1.4; break;
      case 'Luxury': budgetMultiplier = 2.0; break;
    }

    const calculatedBase = basePrice * guestMultiplier * budgetMultiplier;
    const minEstimate = Math.round((calculatedBase * 0.9) / 500) * 500;
    const maxEstimate = Math.round((calculatedBase * 1.15) / 500) * 500;

    setQuoteEstimate({
      min: minEstimate,
      max: maxEstimate
    });
  }, [vendor?.starting_price, quoteForm.guestCount, quoteForm.budgetRange]);

  useEffect(() => {
    calculateEstimate();
  }, [calculateEstimate]);

  const handleScheduleVisitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) {
      navigate(`/customer-login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    setIsSubmittingVisit(true);
    try {
      await saveContactVendor(customer.id, vendorId || '');
      
      const serializedNotes = `Schedule Visit Request:
- Customer Name: ${visitForm.name}
- Phone: ${visitForm.phone}
- Event Type: ${visitForm.eventType}
- Event Date: ${visitForm.eventDate || 'Not specified'}
- Venue Location: ${visitForm.venueLocation || 'Not specified'}
- Preferred Visit Date: ${visitForm.visitDate}
- Preferred Time Slot: ${visitForm.visitTimeSlot}
- Additional Notes: ${visitForm.notes || 'None'}`;

      const response = await updateVendorStatus(
        customer.id,
        vendorId || '',
        'Event Scheduled',
        serializedNotes,
        'customer'
      );

      if (response.success) {
        setVisitSuccess(true);
        setIsContacted(true);
        setContactStatus('Event Scheduled');
        window.dispatchEvent(new CustomEvent('vendorStatusUpdated', { 
          detail: { vendorId, status: 'Event Scheduled' } 
        }));
      } else {
        alert(response.error || 'Failed to submit visit request. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting visit request:', err);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmittingVisit(false);
    }
  };

  const handleRequestQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) {
      navigate(`/customer-login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    setIsSubmittingQuote(true);
    try {
      await saveContactVendor(customer.id, vendorId || '');
      
      const serializedNotes = `Instant Quote Estimate Requested:
- Event Type: ${quoteForm.eventType}
- Guest Count: ${quoteForm.guestCount}
- Budget Range/Class: ${quoteForm.budgetRange}
- Event Date: ${quoteForm.eventDate || 'Not specified'}
- Location: ${quoteForm.location || 'Not specified'}
- Calculated Estimate: ₹${quoteEstimate?.min.toLocaleString()} - ₹${quoteEstimate?.max.toLocaleString()}`;

      const response = await updateVendorStatus(
        customer.id,
        vendorId || '',
        'Discussion in Progress',
        serializedNotes,
        'customer'
      );

      if (response.success) {
        setQuoteSuccess(true);
        setIsContacted(true);
        setContactStatus('Discussion in Progress');
        window.dispatchEvent(new CustomEvent('vendorStatusUpdated', { 
          detail: { vendorId, status: 'Discussion in Progress' } 
        }));
      } else {
        alert(response.error || 'Failed to request quote. Please try again.');
      }
    } catch (err) {
      console.error('Error requesting quote:', err);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmittingQuote(false);
    }
  };

  const [isContacted, setIsContacted] = useState(false);
  const [highlightImages, setHighlightImages] = useState<any[]>([]);
  const [catalogImages, setCatalogImages] = useState<any[]>([]);
  const [highlightedCatalogImages, setHighlightedCatalogImages] = useState<any[]>([]);
  const [customerReviews, setCustomerReviews] = useState<any[]>([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const isAdmin = localStorage.getItem("adminLoggedIn") === "true";
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    minutes: 60,
    seconds: 0
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCoupon, setShowCoupon] = useState(false);
  const [recentClaims, setRecentClaims] = useState(Math.floor(Math.random() * 100) + 1);
  const [showRatingTooltip, setShowRatingTooltip] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [brandLogoUrl, setBrandLogoUrl] = useState<string | null>(null);
  const [contactPersonImageUrl, setContactPersonImageUrl] = useState<string | null>(null);
  const [logoError, setLogoError] = useState(false);

  const rating = useMemo(() => {
    if (customerReviews.length === 0) return vendor?.rating || 4.5;
    const validReviews = customerReviews.filter(r => r.rating);
    if (validReviews.length === 0) return vendor?.rating || 4.5;
    return (validReviews.reduce((sum, r) => sum + r.rating, 0) / validReviews.length).toFixed(1);
  }, [customerReviews, vendor]);

  const reviewCount = useMemo(() => {
    return customerReviews.length;
  }, [customerReviews]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuOpen && !(event.target as Element).closest('.mobile-menu-container')) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [mobileMenuOpen]);

  // Function to refresh reviews and vendor data after review submission
  const refreshVendorData = async () => {
    if (!vendorId) return;
    try {
      const reviews = await getCustomerReviews(vendorId);
      setCustomerReviews(reviews);
    } catch (error) {
      console.error('Error refreshing reviews:', error);
    }
  };

  const handleAddReviewClick = () => {
    if (!customer && !isAdmin) {
      navigate(`/customer-login?redirect=${encodeURIComponent(window.location.pathname)}`);
    } else {
      setShowReviewModal(true);
    }
  };

  // Check contact status - memoized to prevent unnecessary re-renders
  const checkContactStatus = useCallback(async () => {
    if (!customer || !vendorId) return;
    
    try {
      const result = await checkVendorContacted(customer.id, vendorId);
      if (result.success && result.data) {
        setIsContacted(true);
        setContactStatus(result.data.status || 'Contacted');
      } else {
        setIsContacted(false);
        setContactStatus('Contacted');
      }
    } catch (error) {
      console.error('Error checking contact status:', error);
      setIsContacted(false);
      setContactStatus('Contacted');
    }
  }, [customer, vendorId]);

  // Handle status update
  const handleStatusUpdate = (newStatus: string) => {
    setContactStatus(newStatus);
    // Dispatch event to update header if needed
    window.dispatchEvent(new CustomEvent('vendorStatusUpdated', { 
      detail: { vendorId, status: newStatus } 
    }));
  };

  // Load vendor data and media - only depends on vendorId to prevent unnecessary re-fetches
  useEffect(() => {
    const loadVendorData = async () => {
    if (!vendorId) return;

      setIsLoading(true);
      setError(null);

      try {
        console.log('Loading vendor with ID:', vendorId);
        
        // Convert string vendorId to number
        const vendorIdNum = parseInt(vendorId);
        if (isNaN(vendorIdNum)) {
          throw new Error('Invalid vendor ID');
        }

        const vendorIdStr = vendorIdNum.toString();

        // Parallelize all API calls for faster loading
        const [
          vendorData,
          mediaData,
          highlightedCatalog,
          allCatalogImages,
          brandLogo,
          contactPersonImage,
          reviewsData
        ] = await Promise.all([
          getVendorByFieldId(vendorIdStr),
          getVendorMedia(vendorIdStr),
          getHighlightedCatalogImages(vendorIdStr),
          getAllCatalogImages(vendorIdStr),
          getVendorBrandLogoFromStorage(vendorIdStr),
          getVendorContactPersonImageFromStorage(vendorIdStr),
          getCustomerReviews(vendorIdStr)
        ]);

        console.log('Fetched vendor data:', vendorData);
        
        if (!vendorData) {
          throw new Error("Vendor not found");
        }

        setVendor(vendorData);

        // Categorize media
        const highlights = mediaData.filter(m => m.category === 'highlights');
        
        console.log('Fetched vendor media:', mediaData);
        console.log('Fetched highlighted catalog images:', highlightedCatalog);
        console.log('Highlighted catalog count:', highlightedCatalog.length);
        console.log('All catalog images from vendor_media:', allCatalogImages);
        console.log('All catalog images count:', allCatalogImages.length);
        console.log('Brand logo loaded from storage:', brandLogo);
        console.log('Contact person image loaded from storage:', contactPersonImage);
        
        setHighlightImages(highlights);
        setHighlightedCatalogImages(highlightedCatalog);
        setCatalogImages(allCatalogImages);
        setCustomerReviews(reviewsData);
        // Reset logo error state when new logo is loaded
        setLogoError(false);
        setBrandLogoUrl(brandLogo);
        setContactPersonImageUrl(contactPersonImage);
        
        // Reset slide index when images change
        setCurrentSlide(0);

      } catch (err) {
        console.error("Failed to fetch vendor details:", err);
        setError(err instanceof Error ? err.message : 'Failed to load vendor details');
      } finally {
        setIsLoading(false);
      }
    };

    loadVendorData();
  }, [vendorId]); // Removed customer dependency - only fetch when vendorId changes

  // Check contact status separately - only depends on customer and vendorId
  useEffect(() => {
    if (customer && vendorId && vendor) {
      checkContactStatus().catch(err => {
        console.error('Error checking contact status:', err);
      });
    }
  }, [customer, vendorId, vendor, checkContactStatus]); // Only check contact status when customer or vendorId changes

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime.seconds > 0) {
          return { ...prevTime, seconds: prevTime.seconds - 1 };
        } else if (prevTime.minutes > 0) {
          return { minutes: prevTime.minutes - 1, seconds: 59 };
        } else {
          // Timer expired, reset to 60 minutes
          return { minutes: 60, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Auto-play carousel
  useEffect(() => {
    if (isAutoPlaying && highlightedCatalogImages.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % highlightedCatalogImages.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, highlightedCatalogImages.length]);

  // Memoize contact person image URL to prevent unnecessary re-renders
  // MUST be called before any early returns to follow Rules of Hooks
  const contactPersonImageSrc = useMemo(() => {
    return contactPersonImageUrl || "/images/vendor.jpeg";
  }, [contactPersonImageUrl]);

  // Stable error handler for contact person image - prevents flickering
  // MUST be called before any early returns to follow Rules of Hooks
  const handleContactPersonImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement;
    // Only change src if it's not already the fallback to prevent infinite loops
    if (img.src !== `${window.location.origin}/images/vendor.jpeg`) {
      img.src = "/images/vendor.jpeg";
    }
  }, []);

  // WhatsApp integration - now handled by WhatsAppButton component

  // Confetti effect
  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  // Coupon reveal with animation
  const revealCoupon = () => {
    setShowCoupon(true);
    triggerConfetti();
    // Increment recent claims
    setRecentClaims(prev => prev + 1);
  };

  // Copy coupon code
  const copyCouponCode = () => {
    navigator.clipboard.writeText('HAPPYMOMENTS10');
    // You could add a toast notification here
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mb-4"></div>
          <p className="text-lg text-gray-600">Loading vendor details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Vendor not found
  if (!vendor) {
    return <Navigate to="/" />;
  }


  
  // Debug services data
  console.log('=== VENDOR SERVICES DEBUG ===');
  console.log('vendor.services:', vendor.services);
  console.log('vendor.services type:', typeof vendor.services);
  console.log('vendor.services array check:', Array.isArray(vendor.services));
  
  // ONLY use vendor.services - no fallback to hardcoded data
  const services = vendor.services && Array.isArray(vendor.services) && vendor.services.length > 0
    ? vendor.services
    : [];
    
  console.log('Final services to display:', services);
  console.log('Services count:', services.length);

  // Get category icon - handle both string and array
  const getCategoryIcon = (category: string | string[]) => {
    const categoryStr = Array.isArray(category) ? (category[0] || '') : category;
    if (!categoryStr) return Users;
    
    switch (categoryStr.toLowerCase()) {
      case 'photography/videography':
      case 'photographers': return Camera;
      case 'event planners': return Users;
      case 'venues': return Building2;
      case 'decorators': return Sparkles;
      case 'caterers': return Users;
      case 'makeup artists': return Sparkles;
      case 'djs, lighting, and entertainment': return Video;
      case 'anchors': return Users;
      case 'transportation services': return Users;
      case 'fashion/costume designers': return Users;
      case 'tent & equipment rentals': return Building2;
      default: return Users;
    }
  };

  // Get categories array - PRIORITIZE categories field from database
  // Clean and normalize the categories array
  const normalizeCategories = (cats: any): string[] => {
    if (!cats) return [];
    if (Array.isArray(cats)) {
      return cats
        .map((cat: any) => {
          // Handle malformed entries like ["{Caterers}"] or ["{\"Event Planners\"}"]
          if (typeof cat === 'string') {
            // Remove curly braces and escaped quotes
            let cleaned = cat.replace(/^\{+|\}+$/g, '').replace(/\\"/g, '"').replace(/^"+|"+$/g, '').trim();
            return cleaned;
          }
          return String(cat).trim();
        })
        .filter((cat: string) => cat && cat !== '');
    }
    if (typeof cats === 'string') {
      return [cats.trim()].filter(c => c !== '');
    }
    return [];
  };

  // PRIORITIZE categories field (new field), fallback to category (old field)
  const vendorCategories = normalizeCategories(vendor.categories || vendor.category);
  
  const CategoryIcon = getCategoryIcon(vendorCategories);

  return (
    <>
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes ken-burns {
          0% {
            transform: scale(1) translateX(0) translateY(0);
          }
          50% {
            transform: scale(1.05) translateX(-2%) translateY(-1%);
          }
          100% {
            transform: scale(1.1) translateX(-4%) translateY(-2%);
          }
        }
        
        @keyframes card-slide-up {
          from {
            opacity: 0;
            transform: translateY(50px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        
        .animate-ken-burns {
          animation: ken-burns 20s ease-in-out infinite;
        }
        
        .animate-card-slide-up {
          animation: card-slide-up 0.8s ease-out forwards;
        }
        
        .animate-fade-in-up:nth-child(1) { animation-delay: 0.1s; }
        .animate-fade-in-up:nth-child(2) { animation-delay: 0.2s; }
        .animate-fade-in-up:nth-child(3) { animation-delay: 0.3s; }
        .animate-fade-in-up:nth-child(4) { animation-delay: 0.4s; }
      `}</style>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Mobile Header - Clean and Simple */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm lg:hidden mobile-menu-container">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left side - Back button and Company name */}
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-lg"
                title="Go back"
              >
                <ChevronLeft className="h-5 w-5 text-gray-700" />
              </Button>
              <h1 className="text-base font-bold text-gray-900 truncate">{vendor.brand_name}</h1>
            </div>

            {/* Right side - Only Chat, Like, and Hamburger */}
            <div className="flex items-center gap-2">
              {/* Chat Button - Simple */}
              {vendor && (
                <WhatsAppButton
                  vendor={vendor}
                  size="sm"
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-semibold shadow-sm transition-all"
                >
                  Chat
                </WhatsAppButton>
              )}

              {/* Like Button */}
              <LikeButton 
                vendorId={String(vendorId || '')} 
                className="p-2"
              />

              {/* Hamburger Menu */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-gray-700" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-700" />
                )}
              </Button>
              </div>
            </div>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="mt-3 pt-3 border-t border-gray-200 animate-fade-in bg-white rounded-b-lg shadow-lg">
              <div className="space-y-2">
                {/* Rating */}
                <div className="flex items-center justify-between px-4 py-3 bg-amber-50 rounded-lg border border-amber-100">
            <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500 fill-current" />
                    <span className="text-sm font-medium text-gray-700">Rating</span>
                  </div>
                  <span className="text-sm font-bold text-amber-700">{rating}</span>
                </div>

                {/* Contact Status */}
              {customer && isContacted && (
                  <div className="px-4 py-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Contact Status</span>
                    </div>
                    <VendorStatusDropdown
                      customerId={customer.id}
                      vendorId={vendorId || ''}
                      currentStatus={contactStatus}
                      onStatusUpdate={handleStatusUpdate}
                      className="w-full text-sm"
                      vendorName={vendor?.brand_name || vendor?.spoc_name || 'Vendor'}
                      vendorPhoneNumber={vendor?.whatsapp_number || vendor?.phone_number}
                      userType="customer"
                    />
                </div>
              )}

                {/* Action Buttons Row */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {/* Call Button */}
                  <Button
                    onClick={() => {
                      if (vendor?.phone_number) {
                        window.location.href = `tel:${vendor.phone_number}`;
                      }
                      setMobileMenuOpen(false);
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white h-11 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 px-2"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </Button>

                  {/* Visit Button */}
                  <Button
                    onClick={() => {
                      // Handle visit action
                      setMobileMenuOpen(false);
                    }}
                    className="bg-purple-500 hover:bg-purple-600 text-white h-11 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 px-2"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Schedule</span>
                  </Button>

                  {/* Share Button */}
                  <Button
                    onClick={async () => {
                      if (navigator.share) {
                        try {
                          await navigator.share({
                            title: vendor.brand_name,
                            text: `Check out ${vendor.brand_name} on Happy Moments`,
                            url: window.location.href,
                          });
                        } catch (err) {
                          console.log('Error sharing:', err);
                        }
                      } else {
                        // Fallback: Copy to clipboard
                        navigator.clipboard.writeText(window.location.href);
                      }
                      setMobileMenuOpen(false);
                    }}
                    variant="outline"
                    className="border-gray-300 hover:bg-gray-50 h-11 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 px-2 text-gray-700 bg-white"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </Button>
                </div>
            </div>
          </div>
          )}
        </div>
      </div>

      {/* Desktop Header - Original Rich Version */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm hidden lg:block">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Back Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-lg"
                title="Go back"
              >
                <ChevronLeft className="h-5 w-5 text-gray-700" />
              </Button>
              <div className="w-12 h-12 rounded-full border-2 border-blue-500 flex-shrink-0 overflow-hidden bg-white">
                <img 
                  src={logoError || !brandLogoUrl ? "/images/vendor.jpeg" : brandLogoUrl} 
                  alt={vendor.brand_name || 'Vendor'}
                  className="w-full h-full object-cover"
                  loading="eager"
                  onError={() => {
                    if (!logoError) {
                      setLogoError(true);
                    }
                  }}
                  onLoad={(e) => {
                    // Ensure smooth transition when image loads
                    (e.target as HTMLImageElement).style.opacity = '1';
                  }}
                  style={{ 
                    opacity: brandLogoUrl && !logoError ? 0 : 1,
                    transition: 'opacity 0.3s ease-in-out'
                  }}
                />
              </div>
              <div className="flex flex-col gap-2">
                <h1 className="text-xl font-bold text-gray-900 leading-tight">{vendor.brand_name}</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Contact Status - Compact version in header */}
              {customer && isContacted && (
                <div className="px-3 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-700">Status:</span>
                    <VendorStatusDropdown
                      customerId={customer.id}
                      vendorId={vendorId || ''}
                      currentStatus={contactStatus}
                      onStatusUpdate={handleStatusUpdate}
                      className="min-w-[120px]"
                      vendorName={vendor?.brand_name || vendor?.spoc_name || 'Vendor'}
                      vendorPhoneNumber={vendor?.whatsapp_number || vendor?.phone_number}
                    />
                  </div>
                </div>
              )}
              <VendorActionButtons vendor={vendor} />
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section - Mobile Optimized */}
      <div className="relative bg-gradient-to-br from-slate-50 via-amber-50/30 to-orange-50/30">
        {/* Mobile-First Simple Layout */}
        <div className="block lg:hidden">
          <div className="container mx-auto px-4 py-2">
            {/* Mobile Hero Card - Redesigned with Trust & 4 CTA Grid */}
            <div className="bg-white rounded-2xl p-5 shadow-xl border border-orange-200 mb-4">
              {/* Vendor Name */}
              <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">{vendor.brand_name}</h1>
              
              {/* One-line Value Statement */}
              <div className="text-center mb-3">
                <p className="text-xs text-gray-500 font-medium">
                  {vendorCategories.length > 0 ? vendorCategories.slice(0, 2).join(' & ') : 'Professional Services'} | {vendor.address ? vendor.address.split(',').pop()?.trim() : 'Hyderabad'}
                </p>
              </div>

              {/* Category Chips */}
              <div className="flex justify-center gap-2 flex-wrap mb-4">
                {vendorCategories.length > 0 && (
                  <>
                    {vendorCategories.slice(0, 2).map((cat, idx) => (
                      <Badge key={idx} className="px-2 py-0.5 text-[10px] bg-wedding-orange text-white rounded-full font-medium">
                        <CategoryIcon className="w-2.5 h-2.5 mr-1" />
                        {cat}
                      </Badge>
                    ))}
                    {vendorCategories.length > 2 && (
                      <Badge className="px-2 py-0.5 text-[10px] bg-purple-500 text-white rounded-full font-medium">
                        +{vendorCategories.length - 2} more
                      </Badge>
                    )}
                  </>
                )}
              </div>

              {/* Redesigned Mobile Trust Section */}
              <div className="grid grid-cols-2 gap-2 mb-4 bg-slate-50/80 p-3 rounded-xl border border-slate-100 text-[11px]">
                <div className="flex items-center gap-1.5 font-semibold text-gray-700">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                  <span>{rating} Rating</span>
                </div>
                <div className="flex items-center gap-1.5 font-semibold text-green-700">
                  <CheckCircle className="w-3.5 h-3.5 text-green-600 fill-green-50" />
                  <span>Verified Vendor</span>
                </div>
                <div className="flex items-center gap-1.5 font-semibold text-orange-600">
                  <Zap className="w-3.5 h-3.5 text-orange-500 fill-orange-50" />
                  <span>Responds in 15m</span>
                </div>
                <div className="flex items-center gap-1.5 font-semibold text-purple-700">
                  <span>🎉</span>
                  <span>{vendor.events_completed || 150}+ Events</span>
                </div>
                <div className="flex items-center gap-1.5 font-semibold text-blue-700">
                  <MapPin className="w-3.5 h-3.5 text-blue-500" />
                  <span>{vendor.address ? vendor.address.split(',').pop()?.trim() || 'Hyderabad' : 'Hyderabad'}</span>
                </div>
                <div className="flex items-center gap-1.5 font-semibold text-amber-700">
                  <Trophy className="w-3.5 h-3.5 text-amber-600" />
                  <span>{vendor.experience || 'Since 1921'}</span>
                </div>
              </div>

              {/* 4 Action Buttons Above the Fold on Mobile */}
              <div className="space-y-2.5">
                {/* Primary CTA: Get Quote */}
                <Button
                  onClick={() => {
                    const quoteEl = document.getElementById('instant-quote-section');
                    if (quoteEl) {
                      quoteEl.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-5 text-sm font-extrabold rounded-xl shadow-md flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Get Quote (Primary CTA)
                </Button>

                {/* Grid for Schedule, WhatsApp, Call */}
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    onClick={() => setShowVisitModal(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white h-11 rounded-xl text-[10px] font-bold flex flex-col items-center justify-center gap-1 px-1 transition-all active:scale-95"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    Schedule Visit
                  </Button>

                  {vendor && (
                    <WhatsAppButton
                      vendor={vendor}
                      className="bg-green-500 hover:bg-green-600 text-white h-11 rounded-xl text-[10px] font-bold flex flex-col items-center justify-center gap-1 px-1 transition-all active:scale-95"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      WhatsApp
                    </WhatsAppButton>
                  )}

                  <Button
                    onClick={() => {
                      if (vendor?.phone_number) {
                        window.location.href = `tel:${vendor.phone_number}`;
                      }
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white h-11 rounded-xl text-[10px] font-bold flex flex-col items-center justify-center gap-1 px-1 transition-all active:scale-95"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Call Vendor
                  </Button>
                </div>
              </div>

              {/* Status Management - Show only if customer has contacted this vendor */}
              {customer && isContacted && vendorId && (
                <Card className="mt-4 border-2 border-blue-100">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-700">Status:</span>
                      </div>
                    </div>
                    <VendorStatusDropdown
                      customerId={customer.id}
                      vendorId={vendorId}
                      currentStatus={contactStatus}
                      onStatusUpdate={handleStatusUpdate}
                      className="w-full"
                      userType="customer"
                      dropdownDirection="down"
                    />
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Mobile Instant Quote Card */}
            <Card id="instant-quote-section" className="mb-4 overflow-hidden bg-gradient-to-br from-amber-50/90 via-white to-orange-50/90 rounded-2xl border-2 border-orange-200/60 shadow-xl">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-orange-500 animate-pulse" />
                  <h2 className="text-base font-black text-gray-900">Get Instant Quote</h2>
                </div>
                <p className="text-[11px] text-gray-505 text-gray-500 mb-3">
                  Select your choices to generate a customized price range estimate.
                </p>

                {quoteSuccess ? (
                  <div className="text-center py-5 bg-white/70 backdrop-blur-sm rounded-xl border border-green-200 p-4 space-y-2">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900">Quote Request Submitted</h3>
                    <p className="text-[11px] text-gray-600 leading-normal">
                      We have sent your details along with your custom estimate of ₹{quoteEstimate?.min.toLocaleString()} - ₹{quoteEstimate?.max.toLocaleString()} to {vendor.brand_name}.
                    </p>
                    <Button 
                      onClick={() => setQuoteSuccess(false)}
                      variant="outline"
                      size="sm"
                      className="border-green-300 hover:bg-green-50 text-green-700 rounded-lg text-xs"
                    >
                      Calculate New Quote
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleRequestQuoteSubmit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 mb-0.5">Event Type</label>
                        <select
                          value={quoteForm.eventType}
                          onChange={(e) => setQuoteForm(prev => ({ ...prev, eventType: e.target.value }))}
                          className="w-full border border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-lg p-1.5 text-xs bg-white"
                        >
                          <option value="Wedding">Wedding</option>
                          <option value="Reception">Reception</option>
                          <option value="Birthday">Birthday</option>
                          <option value="Corporate">Corporate</option>
                          <option value="Engagement">Engagement</option>
                          <option value="Pre-Wedding">Pre-Wedding</option>
                          <option value="Others">Others</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 mb-0.5">Guests</label>
                        <select
                          value={quoteForm.guestCount}
                          onChange={(e) => setQuoteForm(prev => ({ ...prev, guestCount: e.target.value }))}
                          className="w-full border border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-lg p-1.5 text-xs bg-white"
                        >
                          <option value="<100">&lt; 100 Guests</option>
                          <option value="100-200">100-200 Guests</option>
                          <option value="200-500">200-500 Guests</option>
                          <option value=">500">&gt; 500 Guests</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 mb-0.5">Service Class</label>
                        <select
                          value={quoteForm.budgetRange}
                          onChange={(e) => setQuoteForm(prev => ({ ...prev, budgetRange: e.target.value }))}
                          className="w-full border border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-lg p-1.5 text-xs bg-white"
                        >
                          <option value="Economy">Economy</option>
                          <option value="Mid-range">Standard</option>
                          <option value="Premium">Premium</option>
                          <option value="Luxury">Luxury</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 mb-0.5">Date</label>
                        <Input
                          type="date"
                          required
                          value={quoteForm.eventDate}
                          onChange={(e) => setQuoteForm(prev => ({ ...prev, eventDate: e.target.value }))}
                          className="w-full border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-lg p-1.5 text-xs h-[30px]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-600 mb-0.5">Venue Location</label>
                      <Input
                        type="text"
                        required
                        value={quoteForm.location}
                        onChange={(e) => setQuoteForm(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="e.g. Madhapur, Hyd"
                        className="w-full border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-lg p-1.5 text-xs h-[30px]"
                      />
                    </div>

                    {quoteEstimate && (
                      <div className="bg-white/90 rounded-xl p-2.5 border border-orange-200 text-center my-2 shadow-inner">
                        <p className="text-[9px] uppercase font-bold tracking-wider text-orange-600">Price Estimate Range</p>
                        <p className="text-lg font-black text-amber-600 mt-0.5">
                          ₹{quoteEstimate.min.toLocaleString()} - ₹{quoteEstimate.max.toLocaleString()}
                        </p>
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={isSubmittingQuote}
                      className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs py-3.5 rounded-xl shadow-sm flex items-center justify-center gap-1.5"
                    >
                      {isSubmittingQuote ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Sending Request...
                        </>
                      ) : (
                        <>
                          <Mail className="w-3.5 h-3.5" />
                          Request Detailed Quote
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* GALLERY SECTION - Always Visible in Mobile View */}
            <Card className="mb-4 overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-gray-100">
              <CardContent className="p-4">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-blue-600" />
                  Gallery
                </h2>
                {catalogImages.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {catalogImages.slice(0, 6).map((image, index) => (
                      <Dialog key={`gallery-${index}`}>
                        <DialogTrigger asChild>
                          <div className="relative group cursor-pointer overflow-hidden rounded-lg aspect-square">
                            <img 
                              src={image.media_url} 
                              alt={image.title || `Gallery ${index + 1}`}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            {image.is_highlighted && (
                              <div className="absolute top-2 right-2">
                                <Badge className="bg-yellow-500 text-white text-xs px-1.5 py-0.5">
                                  <Sparkles className="w-2 h-2 mr-1" />
                                  ⭐
                                </Badge>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                          </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <img 
                            src={image.media_url} 
                            alt={image.title || `Gallery ${index + 1}`}
                            className="w-full h-auto rounded-lg"
                          />
                        </DialogContent>
                      </Dialog>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                    <Camera className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-sm text-gray-600 font-medium">No gallery images available yet</p>
                    <p className="text-xs text-gray-500 mt-1">Check back soon for updates</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* OUR SERVICES SECTION - Mobile View */}
            {vendor.services && Array.isArray(vendor.services) && vendor.services.length > 0 && (
              <Card className="mb-4 overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-amber-100">
                <CardContent className="p-4 sm:p-6">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <CategoryIcon className="w-5 h-5 text-amber-600" />
                    Our Services
                  </h2>
                  <p className="text-gray-600 mb-4 text-sm">
                    Specialized in professional {vendorCategories.length > 0 ? vendorCategories.join(', ') : 'services'} services
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    {vendor.services.slice(0, 6).map((service: any, index: number) => (
                      <div key={index} className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200 hover:shadow-md transition-all">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex-shrink-0">
                            <CategoryIcon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 text-base mb-1">{typeof service === 'string' ? service : (service.name || service)}</h3>
                            {typeof service === 'object' && service.description && (
                              <p className="text-xs text-gray-600 mb-2">{service.description}</p>
                            )}
                            {typeof service === 'object' && service.price && (
                              <p className="text-green-600 font-semibold text-sm">₹{service.price}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {vendor.starting_price && (
                    <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 text-center">
                      <p className="text-sm text-gray-600">Starting from</p>
                      <p className="text-xl font-bold text-blue-800">₹{vendor.starting_price.toLocaleString()}</p>
                      <p className="text-xs text-gray-500 mt-1">Custom packages available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* SOCIAL PROOF SECTION - Badges + Reviews */}
            <div className="mb-4 space-y-4">
              {/* Highlight Features Badges */}
              {vendor.highlight_features && vendor.highlight_features.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2">
                  {vendor.highlight_features.slice(0, 3).map((feature: string, index: number) => (
                    <Badge key={index} className="px-4 py-2 text-xs font-semibold bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 border border-blue-200 rounded-full">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {feature}
                    </Badge>
                  ))}
                </div>
              )}
                      {/* Reviews Section with Special Handling for 0 Reviews */}
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-green-100">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <Users className="w-5 h-5 text-green-600" />
                      Customer Reviews
                    </h2>
                    <div className="flex items-center gap-3">
                      {reviewCount > 0 && (
                        <div className="text-right">
                          <div className="text-xl font-bold text-green-600">{rating}★</div>
                          <div className="text-xs text-gray-600">from {reviewCount} customer{reviewCount !== 1 ? 's' : ''}</div>
                        </div>
                      )}
                      <Button
                        onClick={handleAddReviewClick}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                      >
                        Add a Review
                      </Button>
                    </div>
                  </div>
                  
                  {customerReviews && customerReviews.length > 0 ? (
                    <div className="space-y-4">
                      {customerReviews.map((review: any, index: number) => (
                        <div key={index} className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-sm">
                                  {review.customer_name ? review.customer_name.split(' ').map((n: string) => n[0]).join('') : 'U'}
                                </span>
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-800 text-sm">{review.customer_name || 'Customer'}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs font-bold text-amber-600">{review.rating}/5</span>
                                  <span className="text-xs text-gray-505 text-gray-500">{review.date || ''}</span>
                                  {review.verified && (
                                    <Badge className="bg-green-600 text-white text-[10px] px-1.5 py-0.2">✓ Verified</Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed">{review.review}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <p className="text-sm">No reviews yet. Be the first to share your experience!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* OFFERS SECTION - After Services + Social Proof */}
            <Card className="lg:hidden overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-orange-200 bg-white/95 backdrop-blur-md relative mb-4">
              <CardContent className="p-4 relative z-10">
                <div className="text-center mb-3">
                  <h3 className="text-base font-bold text-gray-800">Limited Time Offer</h3>
                </div>
                <div className="mb-3 p-3 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 rounded-xl shadow-lg border-2 border-green-400/30">
                  <div className="flex items-center justify-center gap-2 text-white">
                    <Clock className="w-4 h-4 animate-pulse" />
                    <span className="text-sm font-bold">Contact Now in next 60 minutes & get 10% OFF!</span>
                  </div>
                </div>
                <div className="mb-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-1">Starting from</p>
                    <div className="text-lg font-black text-blue-800">
                      {vendor.starting_price 
                        ? `₹${vendor.starting_price.toLocaleString()}`
                        : 'Contact for Pricing'
                      }
                    </div>
                  </div>
                </div>
                <div className="mb-4 p-3 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-200 text-center">
                  <div className="text-xs font-semibold text-red-700 mb-2">⏰ Limited Time Offer Ends In:</div>
                  <div className={`text-xl font-black text-red-800 flex items-center justify-center gap-2 ${timeLeft.minutes < 5 ? 'animate-pulse' : ''}`}>
                    <span className="bg-red-100 px-2 py-1 rounded-lg">
                      {timeLeft.minutes.toString().padStart(2, '0')}
                    </span>
                    <span className="text-red-500">:</span>
                    <span className="bg-red-100 px-2 py-1 rounded-lg">
                      {timeLeft.seconds.toString().padStart(2, '0')}
                    </span>
                  </div>
                </div>
                {showCoupon && (
                  <div className="mb-4 p-3 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border-2 border-yellow-300">
                    <div className="text-center">
                      <h4 className="text-sm font-bold text-yellow-800 mb-2">🎉 Your Secret Coupon Code!</h4>
                      <div className="flex items-center justify-center gap-2">
                        <div className="bg-yellow-200 px-3 py-1.5 rounded-lg border-2 border-yellow-400">
                          <span className="text-base font-black text-yellow-800">HAPPYMOMENTS10</span>
                        </div>
                        <Button 
                          size="sm"
                          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold text-xs"
                          onClick={copyCouponCode}
                        >
                          Copy
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 text-sm font-bold rounded-xl shadow-xl hover:scale-105 transition-all duration-300"
                  onClick={(e) => { e.stopPropagation(); revealCoupon(); }}
                >
                  <span>🔓</span>
                  <span className="ml-2">Unlock My Secret Offer</span>
                </Button>
              </CardContent>
            </Card>

            {/* CONTACT INFORMATION SECTION - Mobile View */}
            <Card className="mb-4 hover:shadow-lg transition-all duration-300 border-2 border-blue-100">
              <CardContent className="p-4">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                  Contact Information
                </h3>
                <div className="space-y-3">
                  {vendor.phone_number && (
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                      <Phone className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="font-semibold text-gray-800 block text-sm">{vendor.phone_number}</span>
                        <p className="text-xs text-gray-600 mt-1">Call for immediate response</p>
                      </div>
                    </div>
                  )}
                  {vendor.whatsapp_number && (
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                      <MessageCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="font-semibold text-gray-800 block text-sm">{vendor.whatsapp_number}</span>
                        <p className="text-xs text-gray-600 mt-1">WhatsApp for quick chat</p>
                      </div>
                    </div>
                  )}
                  {vendor.email && (
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg border border-pink-200">
                      <Mail className="w-5 h-5 text-pink-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="font-semibold text-gray-800 block text-sm break-all">{vendor.email}</span>
                        <p className="text-xs text-gray-600 mt-1">Email for detailed quotes</p>
                      </div>
                    </div>
                  )}
                  {vendor.instagram && (
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                      <Instagram className="w-5 h-5 text-purple-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <a 
                          href={`https://instagram.com/${vendor.instagram.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-gray-800 block text-sm hover:text-purple-600 transition-colors break-all"
                        >
                          {vendor.instagram}
                        </a>
                        <p className="text-xs text-gray-600 mt-1">Follow for latest work</p>
                      </div>
                    </div>
                  )}
                  {vendor.address && (
                    <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
                  {vendor.google_maps_link ? (
                    <a
                      href={vendor.google_maps_link}
                      target="_blank"
                      rel="noopener noreferrer"
                          className="flex-shrink-0"
                      title="Click to view on Google Maps"
                    >
                          <MapPin className="w-5 h-5 text-emerald-600 hover:text-emerald-700 cursor-pointer hover:scale-110 transition-all" />
                    </a>
                  ) : (
                        <MapPin className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  )}
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-800 text-sm mb-1">Location</div>
                        <p className="text-xs text-gray-600 mb-2">{vendor.address}</p>
                  {vendor.google_maps_link && (
                    <a
                      href={vendor.google_maps_link}
                      target="_blank"
                      rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                    >
                            View on Google Maps
                    </a>
                  )}
                </div>
                </div>
                  )}
              </div>
              </CardContent>
            </Card>

            {/* BOOKING POLICIES SECTION - Mobile View */}
            {vendor.booking_policies && (vendor.booking_policies.payment_terms || vendor.booking_policies.cancellation_policy || vendor.booking_policies.booking_requirements || vendor.booking_policies.advance) && (
              <Card className="mb-4 hover:shadow-lg transition-all duration-300 border-2 border-amber-100">
                <CardContent className="p-4">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800">
                    <Award className="w-5 h-5 text-amber-600" />
                    Booking Policies
                  </h3>
                  <div className="space-y-4">
                    
                    {/* Payment Terms */}
                    {vendor.booking_policies.payment_terms && (
                      <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-sm font-bold">₹</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-green-800 mb-2 text-base">Payment Terms</h4>
                            <p className="text-sm text-green-700 leading-relaxed break-words">
                              {vendor.booking_policies.payment_terms}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Cancellation Policy */}
                    {vendor.booking_policies.cancellation_policy && (
                      <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <X className="w-4 h-4 text-white" />
            </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-red-800 mb-2 text-base">Cancellation Policy</h4>
                            <p className="text-sm text-red-700 leading-relaxed break-words">
                              {vendor.booking_policies.cancellation_policy}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Booking Requirements */}
                    {vendor.booking_policies.booking_requirements && (
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-4 h-4 text-white" />
                </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-blue-800 mb-2 text-base">Booking Requirements</h4>
                            <p className="text-sm text-blue-700 leading-relaxed break-words">
                              {vendor.booking_policies.booking_requirements}
                            </p>
                </div>
                </div>
                  </div>
                )}

                    {/* Advance Payment */}
                    {vendor.booking_policies.advance && (
                      <div className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-200">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-sm font-bold">₹</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-purple-800 mb-2 text-base">Advance Payment</h4>
                            <p className="text-sm text-purple-700 leading-relaxed break-words">
                              {vendor.booking_policies.advance}
                            </p>
                          </div>
                        </div>
              </div>
            )}

                  </div>
                </CardContent>
              </Card>
            )}

            {/* ADDITIONAL INFORMATION SECTION - Mobile View */}
            {vendor.additional_info && (
              <Card className="mb-4 hover:shadow-lg transition-all duration-300 border-2 border-purple-100">
                <CardContent className="p-4">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800">
                    <Info className="w-5 h-5 text-purple-600" />
                    Additional Information
                  </h3>
                  <div className="space-y-4">
                    
                    {/* Working Hours */}
                    {vendor.additional_info.working_hours && (
                      <div className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-200">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <Clock className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-purple-800 mb-2 text-base">Working Hours</h4>
                            <p className="text-sm text-purple-700 leading-relaxed">
                              {vendor.additional_info.working_hours}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Languages */}
                    {((vendor.languages && vendor.languages.length > 0) || 
                      (vendor.languages_spoken && vendor.languages_spoken.length > 0) || 
                      (vendor.additional_info?.languages && Array.isArray(vendor.additional_info.languages) && vendor.additional_info.languages.length > 0)) && (
                      <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <Globe className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-orange-800 mb-2 text-base">Languages Spoken</h4>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {(vendor.languages && vendor.languages.length > 0
                                ? vendor.languages
                                : (vendor.languages_spoken && vendor.languages_spoken.length > 0
                                  ? vendor.languages_spoken
                                  : (vendor.additional_info?.languages || []))
                              ).map((language: string, index: number) => (
                                <span key={index} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                                  {language}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                  </div>
                )}

                    {/* Awards */}
                    {vendor.additional_info.awards && Array.isArray(vendor.additional_info.awards) && vendor.additional_info.awards.length > 0 && (
                      <div className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-200">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <Award className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-yellow-800 mb-2 text-base">Awards & Recognition</h4>
                            <div className="space-y-2 mt-2">
                              {vendor.additional_info.awards.map((award: string, index: number) => (
                                <p key={index} className="text-sm text-yellow-700 leading-relaxed flex items-start gap-2">
                                  <span className="text-yellow-600 mt-1">🏆</span>
                                  {award}
                                </p>
                              ))}
                            </div>
                          </div>
                        </div>
              </div>
            )}

                    {/* Certifications */}
                    {vendor.additional_info.certifications && Array.isArray(vendor.additional_info.certifications) && vendor.additional_info.certifications.length > 0 && (
                      <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-200">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <Scroll className="w-4 h-4 text-white" />
          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-indigo-800 mb-2 text-base">Certifications</h4>
                            <div className="space-y-2 mt-2">
                              {vendor.additional_info.certifications.map((cert: string, index: number) => (
                                <p key={index} className="text-sm text-indigo-700 leading-relaxed flex items-start gap-2">
                                  <span className="text-indigo-600 mt-1">📜</span>
                                  {cert}
                                </p>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Service Areas */}
                    {vendor.additional_info.service_areas && Array.isArray(vendor.additional_info.service_areas) && vendor.additional_info.service_areas.length > 0 && (
                      <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-green-800 mb-2 text-base">Service Areas</h4>
                            <p className="text-sm text-green-700 leading-relaxed break-words">
                              {vendor.additional_info.service_areas.join(', ')}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Custom Fields */}
                    {vendor.additional_info.custom_fields && Array.isArray(vendor.additional_info.custom_fields) && vendor.additional_info.custom_fields.length > 0 && (
                      <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <FileText className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-800 mb-2 text-base">Additional Details</h4>
                            <div className="space-y-3 mt-2">
                              {vendor.additional_info.custom_fields.map((field: any, index: number) => (
                                <div key={index} className="bg-white p-3 rounded-lg border border-gray-200">
                                  <h5 className="font-semibold text-gray-800 text-sm mb-1">{field.field_name}</h5>
                                  <p className="text-sm text-gray-600">{field.field_value}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Desktop Layout (unchanged) */}
        <div className="hidden lg:block min-h-[80vh]">
        <div className="relative z-10 container mx-auto px-6 py-4">
          <div className="max-w-8xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8 items-stretch min-h-[60vh]">
              
              {/* Left Side - Main Content Card */}
              <div className="flex justify-center lg:justify-start lg:flex-[7] relative">
                {/* Subtle divider line */}
                <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent"></div>
                <div className="w-full max-w-[800px] h-full animate-card-slide-up flex flex-col">
                  {/* Main Info Card */}
                  <div className="bg-white/95 backdrop-blur-md rounded-3xl p-12 shadow-2xl border-2 border-amber-200/50 w-full h-full flex flex-col">
                    
                    {/* Name and Profile Row */}
                    <div className="flex items-start mb-4 relative">
                      <div className="flex-1 pr-8">
                        <h1 className="text-5xl lg:text-6xl font-black text-gray-900 leading-tight tracking-tight">
                          {vendor.brand_name}
            </h1>
                        {/* Languages Display - Desktop Hero */}
                        {((vendor.languages && vendor.languages.length > 0) || 
                          (vendor.languages_spoken && vendor.languages_spoken.length > 0) || 
                          (vendor.additional_info?.languages && Array.isArray(vendor.additional_info.languages) && vendor.additional_info.languages.length > 0)) && (
                          <div className="mt-3 flex items-center gap-2 flex-wrap">
                            <span className="text-base font-semibold text-gray-600">Communicates in:</span>
                            <div className="flex flex-wrap gap-2">
                              {(vendor.languages && vendor.languages.length > 0
                                ? vendor.languages
                                : (vendor.languages_spoken && vendor.languages_spoken.length > 0
                                  ? vendor.languages_spoken
                                  : (vendor.additional_info?.languages || []))
                              ).map((language: string, index: number) => (
                                <span 
                                  key={index} 
                                  className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium border border-orange-200"
                                >
                                  {language}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg">
                          <img 
                            key={`contact-person-${vendorId}-${contactPersonImageUrl || 'default'}`}
                            src={contactPersonImageSrc} 
                            alt={vendor.spoc_name || "Contact Person"}
                            className="w-full h-full object-cover"
                            onError={handleContactPersonImageError}
                            loading="eager"
                            style={{ imageRendering: 'auto' }}
                          />
                        </div>
                        <div className="text-center mt-3 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-xl shadow-md border border-gray-200">
                          <div className="text-sm font-bold text-gray-800">{vendor.spoc_name}</div>
                          <div className="text-xs font-semibold text-blue-600 flex items-center gap-1 justify-center">
                            <Users className="w-3 h-3" />
                            Contact Person
                          </div>
                        </div>
                      </div>
                    </div>


                    {/* Category Badges Row - Clean layout for multiple categories */}
                    <div className="flex flex-wrap items-center gap-3 mb-10 -mt-10">
                      {/* Display categories - show first 3, then "+X more" if more exist */}
                      {vendorCategories.length > 0 && (
                        <>
                          {vendorCategories.slice(0, 3).map((cat, idx) => (
                            <Badge key={idx} className="px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2">
                              <CategoryIcon className="w-4 h-4" />
                              {cat}
                            </Badge>
                          ))}
                          {vendorCategories.length > 3 && (
                            <Badge className="px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              +{vendorCategories.length - 3} more
                            </Badge>
                          )}
                        </>
                      )}
                      {vendorCategories.length === 0 && (
                        <Badge className="px-5 py-2.5 text-sm font-semibold bg-gray-500 text-white rounded-xl shadow-md flex items-center gap-2">
                          <CategoryIcon className="w-4 h-4" />
                          Service Provider
                        </Badge>
                      )}
                    </div>

                    {/* Redesigned Desktop Hero trust indications */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 bg-gradient-to-br from-slate-50 to-amber-50/20 p-5 rounded-2xl border border-slate-100 shadow-sm text-sm">
                      <div className="flex items-center gap-2 font-semibold text-gray-700">
                        <span className="text-amber-500 text-base">⭐⭐⭐⭐⭐</span>
                        <span>{rating} Rating</span>
                      </div>
                      <div className="flex items-center gap-2 font-semibold text-green-700">
                        <CheckCircle className="w-4 h-4 text-green-600 fill-green-50" />
                        <span>Verified Vendor</span>
                      </div>
                      <div className="flex items-center gap-2 font-semibold text-orange-600">
                        <Zap className="w-4 h-4 text-orange-500 fill-orange-50" />
                        <span>Responds in 15m</span>
                      </div>
                      <div className="flex items-center gap-2 font-semibold text-purple-700">
                        <span>🎉</span>
                        <span>{vendor.events_completed || 150}+ Completed Events</span>
                      </div>
                      <div className="flex items-center gap-2 font-semibold text-blue-700">
                        <MapPin className="w-4 h-4 text-blue-500" />
                        <span>{locationText}</span>
                      </div>
                      <div className="flex items-center gap-2 font-semibold text-amber-700">
                        <Trophy className="w-4 h-4 text-amber-600" />
                        <span>{experienceText}</span>
                      </div>
                    </div>

                    {/* Tagline */}
                    <p className="text-4xl lg:text-5xl font-bold text-gray-800 mb-8 leading-relaxed relative">
                      <span className="relative z-10">{vendor.quick_intro || vendor.description || "Professional services for your special day"}</span>
                      <div className="absolute -bottom-2 left-0 w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"></div>
                    </p>
                    
                    {/* Cultural Greeting */}
                    {vendor.caption && (
                      <p className="text-xl text-amber-700 font-medium mb-10 italic">
                        "{vendor.caption}"
                      </p>
                    )}

                    {/* Bio */}
                    <p className="text-xl text-gray-700 mb-12 leading-relaxed">
                      {vendor.detailed_intro || `Professional ${vendorCategories.length > 0 ? vendorCategories.join(', ') : 'services'} services${vendor.experience ? ` with ${vendor.experience} of experience` : ''}. We specialize in creating memorable experiences for your special occasions with attention to detail and quality service.`}
                    </p>

                    {/* Details Icons Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                      <div className="flex items-center gap-6 text-gray-700 p-8 bg-gradient-to-r from-amber-50/70 to-orange-50/70 rounded-3xl border-2 border-amber-200/60 shadow-xl hover:shadow-2xl transition-all duration-300">
                        {vendor.google_maps_link ? (
                          <a
                            href={vendor.google_maps_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-20 h-20 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full flex items-center justify-center border-2 border-amber-300 shadow-lg hover:scale-110 transition-transform cursor-pointer"
                            title="Click to view on Google Maps"
                          >
                            <MapPin className="w-10 h-10 text-amber-700" />
                          </a>
                        ) : (
                        <div className="w-20 h-20 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full flex items-center justify-center border-2 border-amber-300 shadow-lg">
                          <MapPin className="w-10 h-10 text-amber-700" />
                        </div>
                        )}
                        <div>
                          <span className="font-bold text-2xl text-gray-800">Location</span>
                          <p className="text-lg text-gray-600">
                            {vendor.additional_info?.service_areas && vendor.additional_info.service_areas.length > 0 
                              ? `Serving ${vendor.additional_info.service_areas.join(', ')}`
                              : vendor.address || "Service areas not specified"
                            }
                          </p>
                          {vendor.google_maps_link && (
                            <a
                              href={vendor.google_maps_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-base text-amber-700 hover:text-amber-800 font-semibold mt-2 transition-colors"
                            >
                              View on Google Maps
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-gray-700 p-8 bg-gradient-to-r from-red-50/70 to-pink-50/70 rounded-3xl border-2 border-red-200/60 shadow-xl hover:shadow-2xl transition-all duration-300">
                        <div className="w-20 h-20 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center border-2 border-red-300 shadow-lg">
                          <Trophy className="w-10 h-10 text-red-700" />
                        </div>
                        <div>
                          <span className="font-bold text-2xl text-gray-800">{vendor.experience || "Experience"}</span>
                          <p className="text-lg text-gray-600">
                            {vendor.events_completed !== undefined && vendor.events_completed > 0 
                              ? `${vendor.events_completed}+ Events Completed`
                              : "Professional Experience"
                            }
                          </p>
                        </div>
                      </div>

                    </div>

                    {/* Redesigned Desktop Action Buttons above the fold */}
                    <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
                      <Button
                        onClick={() => {
                          const quoteEl = document.getElementById('instant-quote-section-desktop');
                          if (quoteEl) {
                            quoteEl.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                        className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-6 text-sm font-extrabold rounded-xl shadow-lg hover:shadow-orange-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                        <Sparkles className="w-4 h-4" />
                        Get Quote (Primary)
                      </Button>

                      <Button
                        onClick={() => setShowVisitModal(true)}
                        className="bg-purple-600 hover:bg-purple-700 text-white py-6 text-sm font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                      >
                        <Calendar className="w-4 h-4" />
                        Schedule Visit
                      </Button>

                      {vendor && (
                        <WhatsAppButton
                          vendor={vendor}
                          className="bg-green-500 hover:bg-green-600 text-white py-6 text-sm font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                          <MessageCircle className="w-4 h-4" />
                          WhatsApp Vendor
                        </WhatsAppButton>
                      )}

                      <Button
                        onClick={() => {
                          if (vendor?.phone_number) {
                            window.location.href = `tel:${vendor.phone_number}`;
                          }
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-6 text-sm font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                      >
                        <Phone className="w-4 h-4" />
                        Call Vendor
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Gallery Carousel */}
              <div className="flex justify-center lg:justify-end lg:flex-[5]">
                <div className="w-full max-w-[600px] h-full flex flex-col animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex-1">
                    <img 
                      src={highlightedCatalogImages.length > 0 ? highlightedCatalogImages[currentSlide]?.media_url : vendor.avatar_url || "/images/vendor.jpeg"} 
                      alt={vendor.brand_name}
                      className="w-full h-full object-cover transition-all duration-1000 hover:scale-105"
                        style={{ imageRendering: 'crisp-edges' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    
                    {/* Featured Badge */}
                    {highlightedCatalogImages.length > 0 && (
                      <div className="absolute top-6 right-6">
                        <Badge className="bg-yellow-500 text-white text-sm px-3 py-1">
                          <Sparkles className="w-4 h-4 mr-1" />
                          Featured Work
                        </Badge>
                      </div>
                    )}
                    
                    {/* Image Info Overlay */}
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                        <h3 className="text-2xl font-bold mb-2 text-white drop-shadow-lg">
                          {highlightedCatalogImages.length > 0 
                            ? "Highlight"
                            : "Our Work"
                          }
                        </h3>
                        <p className="text-base text-white/95 font-medium drop-shadow-md">
                          {highlightedCatalogImages.length > 0 
                            ? "Featured Work"
                            : "Professional services for your special day"
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Image Navigation */}
                  {highlightedCatalogImages.length > 1 && (
                    <div className="flex justify-center mt-6 gap-3">
                      {highlightedCatalogImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={(e) => { e.stopPropagation(); setCurrentSlide(index); }}
                          className={`w-4 h-4 rounded-full transition-all duration-300 ${
                            index === currentSlide ? 'bg-yellow-500 scale-125 shadow-lg' : 'bg-gray-300 hover:bg-gray-400'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
                </div>
              </div>
            </div>

      {/* Section Divider */}
      <div className="h-1 lg:h-4 bg-gradient-to-b from-transparent to-slate-50"></div>

      {/* Main Content - Desktop Only */}
      <div className="hidden lg:block container mx-auto px-3 sm:px-6 py-1 sm:py-2 lg:py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-12">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-2 sm:space-y-4 lg:space-y-6">
            {/* Highlight Features Badges - Mobile Optimized */}
            {vendor.highlight_features && vendor.highlight_features.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-2 sm:mb-3 lg:mb-4">
              {[
                  { icon: Award, color: "from-blue-500 to-cyan-500", bg: "from-blue-50 to-cyan-50", textColor: "text-blue-800" },
                  { icon: CheckCircle, color: "from-purple-500 to-pink-500", bg: "from-purple-50 to-pink-50", textColor: "text-purple-800" },
                  { icon: Clock, color: "from-green-500 to-emerald-500", bg: "from-green-50 to-emerald-50", textColor: "text-green-800" },
                  { icon: Users, color: "from-amber-500 to-orange-500", bg: "from-amber-50 to-orange-50", textColor: "text-amber-800" }
                ].slice(0, vendor.highlight_features.length).map((item, index) => (
                <div 
                  key={index} 
                  className={`px-3 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-semibold bg-gradient-to-r ${item.bg} border border-gray-200 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg group`}
                >
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className={`w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-200 flex-shrink-0`}>
                      <item.icon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
              </div>
                      <span className={item.textColor}>{vendor.highlight_features[index]}</span>
                  </div>
                </div>
              ))}
            </div>
            )}

            {/* Services Section - Mobile Optimized */}
            {services.length > 0 && (
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border border-amber-200">
                <CardContent className="p-3 sm:p-4 lg:p-6">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 lg:mb-4 flex items-center gap-2">
                    <CategoryIcon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-amber-600" />
                    Our Services
                  </h2>
                    <p className="text-gray-600 mb-3 sm:mb-4 lg:mb-6 text-xs sm:text-sm lg:text-base">
                      Specialized in professional {vendorCategories.length > 0 ? vendorCategories.join(', ') : 'services'} services
                    </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                    {services.slice(0, 6).map((service, index) => (
                      <div 
                        key={index}
                        className={`group p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg sm:rounded-xl hover:shadow-lg transition-all duration-300 border border-amber-100`}
                      >
                        <div className="flex items-start gap-2 sm:gap-3">
                          <div className={`p-2 sm:p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg sm:rounded-xl group-hover:scale-110 transition-all duration-300 shadow-md flex-shrink-0`}>
                            <CategoryIcon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
                            </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-base sm:text-lg lg:text-xl text-gray-800 mb-1 group-hover:text-gray-900 transition-colors">
                              {typeof service === 'string' ? service : service.name}
                            </h3>
                            <p className="text-gray-600 text-xs sm:text-sm lg:text-base leading-relaxed mb-1">
                              {typeof service === 'object' && service.description 
                                ? service.description 
                                : 'Professional service with expertise and quality.'}
                            </p>
                            {typeof service === 'object' && service.price && (
                              <p className="text-green-600 font-semibold text-sm sm:text-base lg:text-lg">₹{service.price}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Deliverables Section - Mobile Optimized */}
            {vendor.deliverables && vendor.deliverables.length > 0 && (
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border border-green-200">
                <CardContent className="p-3 sm:p-4 lg:p-6">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 lg:mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-green-600" />
                    What You'll Get
                  </h2>
                  <p className="text-gray-600 mb-3 sm:mb-4 lg:mb-6 text-xs sm:text-sm lg:text-base">Complete deliverables included in our service</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
                    {vendor.deliverables.map((deliverable, index) => (
                      <div 
                        key={index}
                        className="group flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg hover:shadow-md transition-all duration-300 border border-green-200/50"
                      >
                        <div className="flex-shrink-0 p-1.5 sm:p-2 bg-green-500 rounded-full group-hover:scale-110 transition-all duration-300">
                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-800 font-medium text-xs sm:text-sm lg:text-base leading-relaxed">{deliverable}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Packages Section - Only show if vendor has packages in database */}
            {vendor.packages && vendor.packages.length > 0 && (
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-red-100">
                <CardContent className="p-8">
                    <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                      <Award className="w-8 h-8 text-red-600" />
                      {vendorCategories.length > 0 ? vendorCategories.join(' & ') : 'Service'} Packages
                    </h2>
                  <p className="text-gray-600 mb-8 text-lg">Complete packages designed for your special events</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {vendor.packages.map((pkg, index) => (
                      <div 
                        key={index}
                        className={`relative p-8 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${
                          pkg.popular 
                            ? 'border-red-500 bg-gradient-to-br from-red-50 to-pink-50 shadow-lg' 
                            : 'border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50'
                        }`}
                      >
                        {pkg.popular && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <Badge className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-2 text-sm font-bold">⭐ Most Popular</Badge>
                          </div>
                        )}
                        <div className="text-center mb-6">
                          <h3 className="text-2xl font-bold mb-3 text-gray-800">{pkg.name}</h3>
                          {pkg.price && (
                            <div className="text-lg font-bold text-blue-600 mb-2">{pkg.price}</div>
                          )}
                          <div className="text-sm text-gray-500">
                            {pkg.description || `Complete ${vendorCategories.length > 0 ? vendorCategories[0] : 'service'} package`}
                          </div>
                        </div>
                        <ul className="space-y-3 mb-8">
                          {(pkg.features || []).map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-3 text-gray-700">
                              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                              <span className="text-sm font-medium">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        {vendor && (
                          <WhatsAppButton
                            vendor={vendor}
                            className={`w-full py-4 text-lg font-bold rounded-xl transition-all duration-300 ${
                              pkg.popular 
                                ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg' 
                                : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white'
                            }`}
                          >
                            Select {pkg.name} Package
                          </WhatsAppButton>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}


            {/* Complete Catalog Gallery */}
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                  <Video className="w-8 h-8 text-blue-600" />
                  Gallery
                  <Badge className="ml-2 bg-blue-100 text-blue-800 border-blue-200">
                    {catalogImages.length} Images
                  </Badge>
                </h2>
                
                {catalogImages.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {catalogImages.map((image, index) => (
                      <Dialog key={`catalog-${index}`}>
                        <DialogTrigger asChild>
                          <div 
                            className="relative group cursor-pointer overflow-hidden rounded-xl"
                            onClick={(e) => { e.stopPropagation(); setSelectedImage(image); }}
                          >
                            <img 
                              src={image.media_url} 
                              alt={image.title || `Catalog ${index + 1}`}
                              className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            {image.is_highlighted && (
                              <div className="absolute top-2 right-2">
                                <Badge className="bg-yellow-500 text-white text-xs">
                                  <Sparkles className="w-2 h-2 mr-1" />
                                  ⭐
                                </Badge>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <div className="text-white text-center">
                                <Camera className="w-8 h-8 mx-auto mb-2" />
                                <span className="text-sm font-medium">View Full Size</span>
                              </div>
                            </div>
                          </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-6xl">
                          <div className="relative">
                            <img 
                              src={image.media_url} 
                              alt={image.title || `Catalog ${index + 1}`}
                              className="w-full h-auto rounded-lg"
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                    <Camera className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">No Catalog Images</h3>
                    <p className="text-gray-500">This vendor hasn't added any catalog images yet.</p>
                    <Button 
                      onClick={() => window.location.reload()} 
                      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Refresh Page
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Reviews Section - Desktop View */}
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-green-100">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
                  <h2 className="text-3xl font-bold flex items-center gap-3">
                    <Users className="w-8 h-8 text-green-600" />
                    Customer Reviews
                  </h2>
                  <div className="flex items-center gap-4">
                    {reviewCount > 0 && (
                      <div className="text-right">
                        <div className="text-3xl font-bold text-green-600">{rating}★</div>
                        <div className="text-sm text-gray-600">from {reviewCount} customer{reviewCount !== 1 ? 's' : ''}</div>
                      </div>
                    )}
                    <Button
                      onClick={handleAddReviewClick}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Add a Review
                    </Button>
                  </div>
                </div>

                {customerReviews && customerReviews.length > 0 ? (
                  <div className="space-y-6">
                    {customerReviews.map((review: any, index: number) => (
                      <div key={index} className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-md transition-all duration-300">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-lg">
                                {review.customer_name ? review.customer_name.split(' ').map((n: string) => n[0]).join('') : 'U'}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-bold text-lg text-gray-800">{review.customer_name || 'Customer'}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm font-bold text-amber-600">{review.rating}/5</span>
                                <span className="text-sm text-gray-500">{review.date || ''}</span>
                                {review.verified && (
                                  <Badge className="bg-green-600 text-white px-2 py-0.5 text-xs">✓ Verified</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed text-lg">{review.review}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <div className="text-5xl mb-4">📝</div>
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No reviews yet</h3>
                    <p className="text-sm">Be the first to share your experience!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Additional Information Section - Desktop Left Column */}
            {vendor.additional_info && (
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-purple-100">
                <CardContent className="p-6">
                  <h2 className="text-2xl lg:text-3xl font-bold mb-4 lg:mb-6 flex items-center gap-2 text-gray-800">
                    <Info className="w-6 h-6 lg:w-8 lg:h-8 text-purple-600" />
                    Additional Information
                  </h2>
                  <div className="space-y-4 lg:space-y-6">
                    
                    {/* Working Hours */}
                    {vendor.additional_info.working_hours && (
                      <div className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-200">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <Clock className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-purple-800 mb-2">Working Hours</h4>
                            <p className="text-sm text-purple-700 leading-relaxed">
                              {vendor.additional_info.working_hours}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Languages */}
                    {((vendor.languages && vendor.languages.length > 0) || 
                      (vendor.languages_spoken && vendor.languages_spoken.length > 0) || 
                      (vendor.additional_info?.languages && Array.isArray(vendor.additional_info.languages) && vendor.additional_info.languages.length > 0)) && (
                      <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <Globe className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-orange-800 mb-2">Languages Spoken</h4>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {(vendor.languages && vendor.languages.length > 0
                                ? vendor.languages
                                : (vendor.languages_spoken && vendor.languages_spoken.length > 0
                                  ? vendor.languages_spoken
                                  : (vendor.additional_info?.languages || []))
                              ).map((language: string, index: number) => (
                                <span key={index} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                                  {language}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Awards */}
                    {vendor.additional_info.awards && Array.isArray(vendor.additional_info.awards) && vendor.additional_info.awards.length > 0 && (
                      <div className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-200">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <Award className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-yellow-800 mb-2">Awards & Recognition</h4>
                            <div className="space-y-2 mt-2">
                              {vendor.additional_info.awards.map((award: string, index: number) => (
                                <p key={index} className="text-sm text-yellow-700 leading-relaxed flex items-start gap-2">
                                  <span className="text-yellow-600 mt-1">🏆</span>
                                  {award}
                                </p>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Certifications */}
                    {vendor.additional_info.certifications && Array.isArray(vendor.additional_info.certifications) && vendor.additional_info.certifications.length > 0 && (
                      <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-200">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <Scroll className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-indigo-800 mb-2">Certifications</h4>
                            <div className="space-y-2 mt-2">
                              {vendor.additional_info.certifications.map((cert: string, index: number) => (
                                <p key={index} className="text-sm text-indigo-700 leading-relaxed flex items-start gap-2">
                                  <span className="text-indigo-600 mt-1">📜</span>
                                  {cert}
                                </p>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Service Areas */}
                    {vendor.additional_info.service_areas && Array.isArray(vendor.additional_info.service_areas) && vendor.additional_info.service_areas.length > 0 && (
                      <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <MapPin className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-green-800 mb-2">Service Areas</h4>
                            <p className="text-sm text-green-700 leading-relaxed">
                              {vendor.additional_info.service_areas.join(', ')}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Custom Fields */}
                    {vendor.additional_info.custom_fields && Array.isArray(vendor.additional_info.custom_fields) && vendor.additional_info.custom_fields.length > 0 && (
                      <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <FileText className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-800 mb-2">Additional Details</h4>
                            <div className="space-y-3 mt-2">
                              {vendor.additional_info.custom_fields.map((field: any, index: number) => (
                                <div key={index} className="bg-white p-3 rounded-lg border border-gray-200">
                                  <h5 className="font-semibold text-gray-800 text-sm mb-1">{field.field_name}</h5>
                                  <p className="text-sm text-gray-600">{field.field_value}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="hidden lg:block space-y-8">
            {/* Desktop Instant Quote Widget in Sidebar */}
            <Card id="instant-quote-section-desktop" className="overflow-hidden bg-gradient-to-br from-amber-50/90 via-white to-orange-50/90 rounded-2xl border-2 border-orange-200/60 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-orange-500 animate-pulse" />
                  <h2 className="text-lg font-black text-gray-900">Get Instant Quote Estimate</h2>
                </div>
                <p className="text-xs text-gray-600 mb-4 leading-normal">
                  Customize the parameters below to see an instant projected price range based on the vendor's base rates.
                </p>

                {quoteSuccess ? (
                  <div className="text-center py-6 bg-white/80 backdrop-blur-sm rounded-xl border border-green-200 p-4 space-y-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto shadow-sm">
                      <CheckCircle className="w-7 h-7 text-green-600" />
                    </div>
                    <h3 className="text-base font-bold text-gray-950">Quote Request Submitted</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Your preferences and estimated range of ₹{quoteEstimate?.min.toLocaleString()} - ₹{quoteEstimate?.max.toLocaleString()} have been registered and sent directly to {vendor.brand_name}.
                    </p>
                    <Button 
                      onClick={() => setQuoteSuccess(false)}
                      variant="outline"
                      size="sm"
                      className="border-green-300 hover:bg-green-50 text-green-700 rounded-lg text-xs"
                    >
                      Calculate Another Estimate
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleRequestQuoteSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Event Type</label>
                      <select
                        value={quoteForm.eventType}
                        onChange={(e) => setQuoteForm(prev => ({ ...prev, eventType: e.target.value }))}
                        className="w-full border border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl p-2.5 text-sm bg-white"
                      >
                        <option value="Wedding">Wedding</option>
                        <option value="Reception">Reception</option>
                        <option value="Birthday">Birthday</option>
                        <option value="Corporate">Corporate</option>
                        <option value="Engagement">Engagement</option>
                        <option value="Pre-Wedding">Pre-Wedding</option>
                        <option value="Others">Others</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Guest Count</label>
                        <select
                          value={quoteForm.guestCount}
                          onChange={(e) => setQuoteForm(prev => ({ ...prev, guestCount: e.target.value }))}
                          className="w-full border border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl p-2.5 text-sm bg-white"
                        >
                          <option value="<100">&lt; 100 Guests</option>
                          <option value="100-200">100 - 200 Guests</option>
                          <option value="200-500">200 - 500 Guests</option>
                          <option value=">500">&gt; 500 Guests</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Service Tier</label>
                        <select
                          value={quoteForm.budgetRange}
                          onChange={(e) => setQuoteForm(prev => ({ ...prev, budgetRange: e.target.value }))}
                          className="w-full border border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl p-2.5 text-sm bg-white"
                        >
                          <option value="Economy">Economy</option>
                          <option value="Mid-range">Standard</option>
                          <option value="Premium">Premium</option>
                          <option value="Luxury">Luxury</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Event Date</label>
                        <Input
                          type="date"
                          required
                          value={quoteForm.eventDate}
                          onChange={(e) => setQuoteForm(prev => ({ ...prev, eventDate: e.target.value }))}
                          className="w-full border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl text-sm h-[40px]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Venue Area</label>
                        <Input
                          type="text"
                          required
                          value={quoteForm.location}
                          onChange={(e) => setQuoteForm(prev => ({ ...prev, location: e.target.value }))}
                          placeholder="e.g. Madhapur"
                          className="w-full border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl text-sm h-[40px]"
                        />
                      </div>
                    </div>

                    {quoteEstimate && (
                      <div className="bg-white/95 rounded-2xl p-4 border border-orange-200 text-center my-4 shadow-sm">
                        <p className="text-xs uppercase font-extrabold tracking-wider text-orange-600">Calculated Cost Estimate</p>
                        <p className="text-2xl font-black text-amber-600 mt-1">
                          ₹{quoteEstimate.min.toLocaleString()} - ₹{quoteEstimate.max.toLocaleString()}
                        </p>
                        <p className="text-[10px] text-gray-500 mt-1">Estimates are directional and subject to specific custom additions.</p>
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={isSubmittingQuote}
                      className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm py-4 rounded-xl shadow-lg hover:shadow-orange-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                    >
                      {isSubmittingQuote ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Submitting Quote Request...
                        </>
                      ) : (
                        <>
                          <Mail className="w-5 h-5" />
                          Request Detailed Quote
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Quick Contact Card - Enhanced for Maximum Conversions */}
            <Card className="sticky top-4 bg-white/95 backdrop-blur-md border-2 border-white/30 shadow-2xl relative overflow-hidden">
              {/* Confetti Effect */}
              {showConfetti && (
                <div className="absolute inset-0 pointer-events-none z-50">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <div className="text-6xl">🎉</div>
    </div>
                  <div className="absolute top-4 left-1/4 animate-bounce" style={{ animationDelay: '0.2s' }}>
                    <div className="text-4xl">✨</div>
                  </div>
                  <div className="absolute top-6 right-1/4 animate-bounce" style={{ animationDelay: '0.4s' }}>
                    <div className="text-4xl">🎊</div>
                  </div>
                </div>
              )}
              
              <CardContent className="p-6 relative z-10">
                {/* Headline Hook */}
                <div className="text-center mb-4">
                  <h3 className="text-lg font-bold text-gray-800">Best {vendorCategories.length > 0 ? vendorCategories.join(' & ') : 'Service'} Service – Limited Spot!</h3>
                  </div>

                {/* Social Proof Badge */}
                <div className="mb-4 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 rounded-full border border-orange-200">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-bold text-red-700">{recentClaims} people claimed this offer today!</span>
                  </div>
                </div>

                {/* Urgency Banner */}
                <div className="mb-4 p-4 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 rounded-2xl shadow-lg border-2 border-green-400/30">
                  <div className="flex items-center justify-center gap-3 text-white">
                    <Clock className="w-6 h-6 animate-pulse" />
                    <span className="text-lg font-bold">Contact Now in next 60 minutes & get 10% OFF!</span>
                    <span className="text-2xl">🎯</span>
                  </div>
                </div>

                {/* Starting Price Highlight */}
                <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200 shadow-md">
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">₹</span>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-black text-blue-800">
                        {vendor.starting_price 
                          ? `Starting ₹${vendor.starting_price.toLocaleString()}`
                          : 'Contact for Pricing'
                        }
                      </div>
                      <div className="text-sm text-blue-600 font-semibold">Professional {vendorCategories.length > 0 ? vendorCategories.join(' & ') : 'Service'}</div>
                    </div>
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">✓</span>
                    </div>
                  </div>
                </div>

                {/* Animated Countdown Timer */}
                <div className="mb-6 p-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl border border-red-200 text-center">
                  <div className="text-sm font-semibold text-red-700 mb-2">⏰ Limited Time Offer Ends In:</div>
                  <div className={`text-4xl font-black text-red-800 flex items-center justify-center gap-2 ${timeLeft.minutes < 5 ? 'animate-pulse' : ''}`}>
                    <span className="bg-red-100 px-3 py-2 rounded-lg">
                      {timeLeft.minutes.toString().padStart(2, '0')}
                    </span>
                    <span className="text-red-500">:</span>
                    <span className="bg-red-100 px-3 py-2 rounded-lg">
                      {timeLeft.seconds.toString().padStart(2, '0')}
                    </span>
                  </div>
                  <div className="text-xs text-red-600 mt-2">Minutes : Seconds</div>
                </div>

                {/* Coupon Reveal Section */}
                {showCoupon && (
                  <div className="mb-6 p-6 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl border-2 border-yellow-300 animate-bounce">
                    <div className="text-center">
                      <h4 className="text-lg font-bold text-yellow-800 mb-3">🎉 Your Secret Coupon Code!</h4>
                      <div className="flex items-center justify-center gap-3">
                        <div className="bg-yellow-200 px-4 py-2 rounded-lg border-2 border-yellow-400">
                          <span className="text-2xl font-black text-yellow-800">HAPPYMOMENTS10</span>
                        </div>
                        <Button 
                          size="sm"
                          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold"
                          onClick={copyCouponCode}
                        >
                          Copy
                        </Button>
                      </div>
                      <p className="text-sm text-yellow-700 mt-2">Use this code when you contact us!</p>
                    </div>
                  </div>
                )}
                
                {/* Enhanced CTA Buttons */}
                <div className="space-y-4">
                  {/* WhatsApp Quick Chat Button */}
                  {vendor && (
                    <WhatsAppButton
                      vendor={vendor}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 active:from-green-700 active:to-emerald-800 text-white py-8 text-2xl font-black rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 relative overflow-hidden group animate-pulse"
                    >
                      <div className="absolute inset-0 bg-white/20 scale-0 group-active:scale-100 transition-transform duration-200 rounded-2xl"></div>
                      <span className="relative z-10">💬 WhatsApp Quick Chat</span>
                      <div className="absolute top-0 right-0 text-3xl animate-bounce">🚀</div>
                    </WhatsAppButton>
                  )}
                  
                  {/* Unlock Secret Offer Button */}
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 active:from-purple-800 active:to-pink-800 text-white py-8 text-2xl font-black rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 relative overflow-hidden group"
                    onClick={(e) => { e.stopPropagation(); revealCoupon(); }}
                  >
                    <div className="absolute inset-0 bg-white/20 scale-0 group-active:scale-100 transition-transform duration-200 rounded-2xl"></div>
                    <div className="flex items-center justify-center gap-3 relative z-10">
                      <span>🔓</span>
                      <span>Unlock My Secret Offer</span>
                      <span>🎁</span>
                    </div>
                  </Button>
                  
                  {/* Request Callback Button */}
                  {vendor && (
                    <WhatsAppButton
                      vendor={vendor}
                      className="w-full border-3 border-purple-500 text-purple-700 hover:bg-purple-50 hover:border-purple-600 py-6 text-lg font-bold rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg bg-transparent hover:bg-purple-50"
                    >
                      <Phone className="w-6 h-6 mr-3" />
                      Request Callback
                    </WhatsAppButton>
                  )}

                  {/* Status Management - Show only if customer has contacted this vendor */}
                  {customer && isContacted && vendorId && (
                    <div className="mt-4 p-4 bg-white/70 rounded-xl border border-blue-200">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-gray-700">Status:</span>
                      </div>
                      <VendorStatusDropdown
                        customerId={customer.id}
                        vendorId={vendorId}
                        currentStatus={contactStatus}
                        onStatusUpdate={handleStatusUpdate}
                        className="w-full"
                        userType="customer"
                        dropdownDirection="down"
                      />
                    </div>
                  )}
                </div>
                
                {/* Benefits */}
                <div className="mt-6 space-y-3">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center gap-3 p-3 bg-white/70 rounded-xl border border-green-200">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm font-semibold text-gray-700">Free consultation</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/70 rounded-xl border border-green-200">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm font-semibold text-gray-700">Same day response</span>
                  </div>
                    <div className="flex items-center gap-3 p-3 bg-white/70 rounded-xl border border-green-200">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm font-semibold text-gray-700">Flexible payment options</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="hover:shadow-lg transition-all duration-300 border-2 border-purple-100">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800">
                  <MessageCircle className="w-6 h-6 text-purple-600" />
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg hover:from-purple-100 hover:to-indigo-100 transition-colors border border-purple-200">
                    <Phone className="w-6 h-6 text-purple-600" />
                    <div>
                      <span className="font-semibold text-gray-800">{vendor.phone_number}</span>
                      <p className="text-sm text-gray-600">Call for immediate response</p>
                    </div>
                  </div>
                  {vendor.whatsapp_number && (
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg hover:from-amber-100 hover:to-orange-100 transition-colors border border-amber-200">
                      <MessageCircle className="w-6 h-6 text-amber-600" />
                      <div>
                        <span className="font-semibold text-gray-800">{vendor.whatsapp_number}</span>
                        <p className="text-sm text-gray-600">WhatsApp for quick chat</p>
                      </div>
                    </div>
                  )}
                  {vendor.email && (
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg hover:from-pink-100 hover:to-rose-100 transition-colors border border-pink-200">
                      <Mail className="w-6 h-6 text-pink-600" />
                      <div>
                        <span className="font-semibold text-gray-800">{vendor.email}</span>
                        <p className="text-sm text-gray-600">Email for detailed quotes</p>
                      </div>
                    </div>
                  )}
                  {vendor.instagram && (
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg hover:from-pink-100 hover:to-rose-100 transition-colors border border-pink-200">
                      <Instagram className="w-6 h-6 text-pink-600" />
                      <div>
                        <span className="font-semibold text-gray-800">{vendor.instagram}</span>
                        <p className="text-sm text-gray-600">Follow for latest work</p>
              </div>
              </div>
            )}
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg hover:from-emerald-100 hover:to-teal-100 transition-colors border border-emerald-200">
                    {vendor.google_maps_link ? (
                      <a
                        href={vendor.google_maps_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0"
                        title="Click to view on Google Maps"
                      >
                        <MapPin className="w-6 h-6 text-emerald-600 hover:text-emerald-700 cursor-pointer hover:scale-110 transition-all" />
                      </a>
                    ) : (
                      <MapPin className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800 mb-1">Location</div>
                      <p className="text-sm text-gray-600 mb-2">{vendor.address || 'Location not specified'}</p>
                      {vendor.google_maps_link && (
                        <a
                          href={vendor.google_maps_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium mt-2 transition-colors"
                        >
                          View on Google Maps
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Policies Section */}
            <Card className="hover:shadow-lg transition-all duration-300 border-2 border-blue-100">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800">
                  <Award className="w-6 h-6 text-blue-600" />
                  Booking Policies
                </h3>
                <div className="space-y-6">
                  
                  {/* Payment Terms Policy */}
                  {vendor.booking_policies?.payment_terms && (
                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-white text-sm font-bold">₹</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-green-800 mb-2">Payment Terms</h4>
                          <p className="text-sm text-green-700 leading-relaxed">
                            {vendor.booking_policies.payment_terms}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Cancellation Policy */}
                  {vendor.booking_policies?.cancellation_policy && (
                    <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-white text-sm font-bold">↩</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-orange-800 mb-2">Cancellation Policy</h4>
                          <p className="text-sm text-orange-700 leading-relaxed">
                            {vendor.booking_policies.cancellation_policy}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Booking Requirements */}
                  {vendor.booking_policies?.booking_requirements && (
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-white text-sm font-bold">✓</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-blue-800 mb-2">Booking Requirements</h4>
                          <p className="text-sm text-blue-700 leading-relaxed">
                            {vendor.booking_policies.booking_requirements}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Advance Payment */}
                  {vendor.booking_policies?.advance && (
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-white text-sm font-bold">₹</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-purple-800 mb-2">Advance Payment</h4>
                          <p className="text-sm text-purple-700 leading-relaxed">
                            {vendor.booking_policies.advance}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Show message if no policies are available */}
                  {!vendor.booking_policies?.payment_terms && !vendor.booking_policies?.cancellation_policy && !vendor.booking_policies?.booking_requirements && !vendor.booking_policies?.advance && (
                    <div className="text-center py-8 text-gray-500">
                      <p>No booking policies available for this vendor.</p>
                    </div>
                  )}

                </div>
              </CardContent>
            </Card>
                          </div>
        </div>
      </div>

      {/* Sticky WhatsApp Button */}
      {vendor && (
        <div className="fixed bottom-6 right-6 z-50">
          <WhatsAppButton
            vendor={vendor}
            size="lg"
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full shadow-2xl hover:scale-110 transition-all duration-300 animate-pulse"
          >
            Chat Now
          </WhatsAppButton>
        </div>
      )}

      {/* Add Review Modal */}
      {(customer || isAdmin) && vendorId && (
        <AddReviewModal
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          vendorId={vendorId}
          onReviewSubmitted={refreshVendorData}
        />
      )}

      {/* Schedule Visit Modal */}
      <Dialog open={showVisitModal} onOpenChange={setShowVisitModal}>
        <DialogContent className="sm:max-w-[500px] bg-white rounded-2xl p-6 shadow-2xl border border-purple-100 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-bold text-purple-900 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-purple-600" />
              Schedule a Visit
            </DialogTitle>
            <DialogDescription className="text-gray-500">
              Book an in-person or virtual consultation with {vendor.brand_name}.
            </DialogDescription>
          </DialogHeader>

          {visitSuccess ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Visit Scheduled!</h3>
              <p className="text-gray-600">
                Your request has been successfully recorded. {vendor.brand_name} will get in touch with you shortly to confirm the slot.
              </p>
              <Button 
                onClick={() => {
                  setShowVisitModal(false);
                  setVisitSuccess(false);
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 rounded-xl"
              >
                Close
              </Button>
            </div>
          ) : (
            <form onSubmit={handleScheduleVisitSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Your Name</label>
                <Input
                  type="text"
                  required
                  value={visitForm.name}
                  onChange={(e) => setVisitForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border-gray-200 focus:border-purple-500 focus:ring-purple-500 rounded-xl"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                <Input
                  type="tel"
                  required
                  value={visitForm.phone}
                  onChange={(e) => setVisitForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full border-gray-200 focus:border-purple-500 focus:ring-purple-500 rounded-xl"
                  placeholder="Enter mobile number"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Event Type</label>
                  <select
                    value={visitForm.eventType}
                    onChange={(e) => setVisitForm(prev => ({ ...prev, eventType: e.target.value }))}
                    className="w-full border border-gray-200 focus:border-purple-500 focus:ring-purple-500 rounded-xl p-2.5 text-sm bg-white"
                  >
                    <option value="Wedding">Wedding</option>
                    <option value="Reception">Reception</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Engagement">Engagement</option>
                    <option value="Pre-Wedding">Pre-Wedding</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Event Date</label>
                  <Input
                    type="date"
                    value={visitForm.eventDate}
                    onChange={(e) => setVisitForm(prev => ({ ...prev, eventDate: e.target.value }))}
                    className="w-full border-gray-200 focus:border-purple-500 focus:ring-purple-500 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Venue Location</label>
                <Input
                  type="text"
                  value={visitForm.venueLocation}
                  onChange={(e) => setVisitForm(prev => ({ ...prev, venueLocation: e.target.value }))}
                  placeholder="e.g. Gachibowli, Hyderabad"
                  className="w-full border-gray-200 focus:border-purple-500 focus:ring-purple-500 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Preferred Visit Date</label>
                  <Input
                    type="date"
                    required
                    value={visitForm.visitDate}
                    onChange={(e) => setVisitForm(prev => ({ ...prev, visitDate: e.target.value }))}
                    className="w-full border-gray-200 focus:border-purple-500 focus:ring-purple-500 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Preferred Slot</label>
                  <select
                    value={visitForm.visitTimeSlot}
                    onChange={(e) => setVisitForm(prev => ({ ...prev, visitTimeSlot: e.target.value }))}
                    className="w-full border border-gray-200 focus:border-purple-500 focus:ring-purple-500 rounded-xl p-2.5 text-sm bg-white"
                  >
                    <option value="Morning (10 AM - 12 PM)">Morning (10 AM - 12 PM)</option>
                    <option value="Afternoon (12 PM - 4 PM)">Afternoon (12 PM - 4 PM)</option>
                    <option value="Evening (4 PM - 8 PM)">Evening (4 PM - 8 PM)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Notes / Special Instructions</label>
                <Textarea
                  value={visitForm.notes}
                  onChange={(e) => setVisitForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Share any details about your event or what you are looking for..."
                  className="w-full border-gray-200 focus:border-purple-500 focus:ring-purple-500 rounded-xl min-h-[80px]"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmittingVisit}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-purple-500/20 transition-all flex items-center justify-center gap-2"
              >
                {isSubmittingVisit ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Scheduling Visit...
                  </>
                ) : (
                  'Schedule Visit'
                )}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

    </div>
    </>
  );
};

export default VendorProfile;