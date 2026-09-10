import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface BusinessOwner {
  id: string;
  fullName: string;
  companyName: string;
  email: string;
  mobileNumber: string;
  businessType: 
    | 'Retail / D2C Brand'
    | 'Tech Startup'
    | 'Corporate / Enterprise'
    | 'Exhibition Organizer'
    | 'F&B Brand'
    | 'Artisan / Pop-up Vendor'
    | 'Other';
  city: string;
  websiteUrl?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface BusinessInquiry {
  id: string;
  spaceId: string;
  spaceTitle: string;
  spaceCategory: string;
  spaceCity: string;
  pricing: string;
  eventDate: string;
  durationDays: number;
  expectedFootfall: number;
  requirements: string;
  status: 'Inquiry Sent' | 'Quote Received' | 'Site Visit Scheduled' | 'Confirmed';
  createdAt: string;
}

interface BusinessAuthContextType {
  businessOwner: BusinessOwner | null;
  loading: boolean;
  inquiries: BusinessInquiry[];
  signUp: (data: {
    fullName: string;
    companyName: string;
    email: string;
    mobileNumber: string;
    businessType: BusinessOwner['businessType'];
    city: string;
    websiteUrl?: string;
    password: string;
  }) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
  updateProfile: (updates: Partial<BusinessOwner>) => Promise<{ success: boolean; error?: string }>;
  addInquiry: (inquiry: Omit<BusinessInquiry, 'id' | 'createdAt' | 'status'>) => void;
  interestedVenueIds: string[];
  notInterestedVenueIds: string[];
  toggleInterestedVenue: (venueId: string) => void;
  markNotInterestedVenue: (venueId: string) => void;
  undoNotInterestedVenue: (venueId: string) => void;
  isInterested: (venueId: string) => boolean;
  isNotInterested: (venueId: string) => boolean;
  clearNotInterestedVenues: () => void;
}

const BusinessAuthContext = createContext<BusinessAuthContextType | undefined>(undefined);

const STORAGE_KEY_SESSION = 'spotlight_business_owner';
const STORAGE_KEY_USERS = 'spotlight_business_registered_users';
const STORAGE_KEY_INQUIRIES = 'spotlight_business_inquiries';
const STORAGE_KEY_INTERESTED = 'spotlight_business_interested_venues';
const STORAGE_KEY_NOT_INTERESTED = 'spotlight_business_not_interested_venues';

// Initial Demo Business Account for instant access
const DEMO_ACCOUNT: BusinessOwner & { passwordHash: string } = {
  id: 'biz_demo_101',
  fullName: 'Vikramaditya Sharma',
  companyName: 'Aura Innovations Pvt Ltd',
  email: 'business@spotlight.com',
  mobileNumber: '+91 98765 43210',
  businessType: 'Tech Startup',
  city: 'Hyderabad',
  websiteUrl: 'https://aurainnovations.io',
  createdAt: new Date().toISOString(),
  passwordHash: btoa('Business@123')
};

export const BusinessAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [businessOwner, setBusinessOwner] = useState<BusinessOwner | null>(null);
  const [loading, setLoading] = useState(true);
  const [inquiries, setInquiries] = useState<BusinessInquiry[]>([]);

  // Load registered users and current session from localStorage
  useEffect(() => {
    try {
      // Ensure demo account is seeded in registered users store
      const registeredStr = localStorage.getItem(STORAGE_KEY_USERS);
      let registeredUsers: any[] = [];
      if (registeredStr) {
        registeredUsers = JSON.parse(registeredStr);
      }
      if (!registeredUsers.some(u => u.email.toLowerCase() === DEMO_ACCOUNT.email.toLowerCase())) {
        registeredUsers.push(DEMO_ACCOUNT);
        localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(registeredUsers));
      }

      // Check current active session
      const savedSession = localStorage.getItem(STORAGE_KEY_SESSION);
      if (savedSession) {
        setBusinessOwner(JSON.parse(savedSession));
      }

      // Load inquiries
      const savedInquiries = localStorage.getItem(STORAGE_KEY_INQUIRIES);
      if (savedInquiries) {
        setInquiries(JSON.parse(savedInquiries));
      }
    } catch (err) {
      console.error('Error initializing BusinessAuthContext:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const signUp = async (data: {
    fullName: string;
    companyName: string;
    email: string;
    mobileNumber: string;
    businessType: BusinessOwner['businessType'];
    city: string;
    websiteUrl?: string;
    password: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      const emailLower = data.email.trim().toLowerCase();
      const registeredStr = localStorage.getItem(STORAGE_KEY_USERS) || '[]';
      const registeredUsers: any[] = JSON.parse(registeredStr);

      if (registeredUsers.some(u => u.email.toLowerCase() === emailLower)) {
        return { success: false, error: 'An account with this business email already exists.' };
      }

      if (!data.mobileNumber || !data.mobileNumber.trim()) {
        return { success: false, error: 'Mobile / WhatsApp phone number is mandatory for business registration.' };
      }

      const cleanPhone = data.mobileNumber.replace(/[^0-9]/g, '');
      if (cleanPhone.length < 10) {
        return { success: false, error: 'Please enter a valid 10-digit mobile number (Mandatory).' };
      }

      const newOwner: BusinessOwner & { passwordHash: string } = {
        id: `biz_${Date.now()}`,
        fullName: data.fullName.trim(),
        companyName: data.companyName.trim(),
        email: emailLower,
        mobileNumber: data.mobileNumber.trim(),
        businessType: data.businessType,
        city: data.city.trim(),
        websiteUrl: data.websiteUrl?.trim() || '',
        createdAt: new Date().toISOString(),
        passwordHash: btoa(data.password)
      };

      registeredUsers.push(newOwner);
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(registeredUsers));

      // Auto login
      const { passwordHash, ...ownerData } = newOwner;
      setBusinessOwner(ownerData);
      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(ownerData));

      // Also persist to Supabase customers table
      try {
        supabase
          .from('customers')
          .insert([{
            full_name: data.fullName.trim(),
            email: emailLower,
            password_hash: btoa(data.password),
            mobile_number: data.mobileNumber.trim(),
            location: data.city.trim() || 'Hyderabad',
            status: 'active'
          }])
          .then(({ error: sbErr }) => {
            if (sbErr) {
              console.warn('Supabase customer insert notice:', sbErr.message);
            } else {
              console.log('✅ Business owner registered in Supabase customers table');
            }
          });
      } catch (e) {
        console.warn('Supabase customer sync exception:', e);
      }

      return { success: true };
    } catch (err: any) {
      console.error('Business Signup error:', err);
      return { success: false, error: err.message || 'Failed to create business account' };
    }
  };

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const emailLower = email.trim().toLowerCase();
      const passwordHash = btoa(password);

      const registeredStr = localStorage.getItem(STORAGE_KEY_USERS) || '[]';
      const registeredUsers: any[] = JSON.parse(registeredStr);

      const foundUser = registeredUsers.find(
        u => u.email.toLowerCase() === emailLower && u.passwordHash === passwordHash
      );

      if (!foundUser) {
        return { success: false, error: 'Invalid business email or password.' };
      }

      const { passwordHash: _, ...ownerData } = foundUser;
      const updatedOwner = {
        ...ownerData,
        lastLoginAt: new Date().toISOString()
      };

      setBusinessOwner(updatedOwner);
      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(updatedOwner));

      return { success: true };
    } catch (err: any) {
      console.error('Business SignIn error:', err);
      return { success: false, error: err.message || 'Failed to sign in' };
    }
  };

  const signOut = () => {
    setBusinessOwner(null);
    localStorage.removeItem(STORAGE_KEY_SESSION);
  };

  const updateProfile = async (updates: Partial<BusinessOwner>): Promise<{ success: boolean; error?: string }> => {
    if (!businessOwner) {
      return { success: false, error: 'Not authenticated' };
    }

    try {
      const updated = { ...businessOwner, ...updates };
      setBusinessOwner(updated);
      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(updated));

      // Update in registered users list
      const registeredStr = localStorage.getItem(STORAGE_KEY_USERS) || '[]';
      const registeredUsers: any[] = JSON.parse(registeredStr);
      const idx = registeredUsers.findIndex(u => u.id === businessOwner.id);
      if (idx !== -1) {
        registeredUsers[idx] = { ...registeredUsers[idx], ...updates };
        localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(registeredUsers));
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to update profile' };
    }
  };

  const addInquiry = (inquiryData: Omit<BusinessInquiry, 'id' | 'createdAt' | 'status'>) => {
    const newInquiry: BusinessInquiry = {
      ...inquiryData,
      id: `inq_${Date.now()}`,
      status: 'Inquiry Sent',
      createdAt: new Date().toISOString()
    };

    const updated = [newInquiry, ...inquiries];
    setInquiries(updated);
    localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify(updated));

    // Also persist to Supabase vendor_leads table
    try {
      const VENUE_VENDOR_ID_MAP: Record<string, number> = {
        'venue-pragnya-degree-college': 1041,
        'venue-avinash-college': 1042,
        'venue-klh-global-business-school': 1043,
        'venue-couch-potato-lounges': 1044,
        'venue-cbit-auditorium': 1045,
        'venue-thub-catalyst': 1046,
        'venue-hicc-grand-ballroom': 1047,
        'venue-itc-kohenur-ballroom': 1048,
      };
      const vendorId = VENUE_VENDOR_ID_MAP[inquiryData.spaceId] || 1041;

      supabase
        .from('vendor_leads')
        .insert([{
          vendor_id: vendorId,
          customer_name: businessOwner ? `${businessOwner.fullName} (${businessOwner.companyName})` : 'Business Portal Client',
          customer_phone: businessOwner?.mobileNumber || '7330732710',
          customer_email: businessOwner?.email || 'business@happymomentsindia.com',
          event_type: inquiryData.spaceCategory,
          event_venue: inquiryData.spaceTitle,
          budget_range: inquiryData.pricing,
          lead_source: 'HappyMoments Business Portal',
          status: 'new_lead',
          initial_notes: `${inquiryData.requirements} | Date: ${inquiryData.eventDate} | Footfall: ${inquiryData.expectedFootfall}`
        }])
        .then(({ error: leadErr }) => {
          if (leadErr) {
            console.warn('Supabase lead insert notice:', leadErr.message);
          } else {
            console.log('✅ Lead saved in Supabase vendor_leads table');
          }
        });
    } catch (e) {
      console.warn('Supabase lead sync exception:', e);
    }
  };

  // Interested & Not Interested Venues State
  const [interestedVenueIds, setInterestedVenueIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_INTERESTED);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [notInterestedVenueIds, setNotInterestedVenueIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_NOT_INTERESTED);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleInterestedVenue = (venueId: string) => {
    setInterestedVenueIds(prev => {
      const exists = prev.includes(venueId);
      const next = exists ? prev.filter(id => id !== venueId) : [...prev, venueId];
      try {
        localStorage.setItem(STORAGE_KEY_INTERESTED, JSON.stringify(next));
      } catch (err) {
        console.error('Error saving interested venues:', err);
      }
      return next;
    });

    // If marked interested, remove from not-interested
    setNotInterestedVenueIds(prev => {
      if (prev.includes(venueId)) {
        const next = prev.filter(id => id !== venueId);
        try {
          localStorage.setItem(STORAGE_KEY_NOT_INTERESTED, JSON.stringify(next));
        } catch (err) {
          console.error('Error saving not-interested venues:', err);
        }
        return next;
      }
      return prev;
    });
  };

  const markNotInterestedVenue = (venueId: string) => {
    setNotInterestedVenueIds(prev => {
      if (!prev.includes(venueId)) {
        const next = [...prev, venueId];
        try {
          localStorage.setItem(STORAGE_KEY_NOT_INTERESTED, JSON.stringify(next));
        } catch (err) {
          console.error('Error saving not-interested venues:', err);
        }
        return next;
      }
      return prev;
    });

    // Remove from interested if present
    setInterestedVenueIds(prev => {
      if (prev.includes(venueId)) {
        const next = prev.filter(id => id !== venueId);
        try {
          localStorage.setItem(STORAGE_KEY_INTERESTED, JSON.stringify(next));
        } catch (err) {
          console.error('Error saving interested venues:', err);
        }
        return next;
      }
      return prev;
    });
  };

  const undoNotInterestedVenue = (venueId: string) => {
    setNotInterestedVenueIds(prev => {
      const next = prev.filter(id => id !== venueId);
      try {
        localStorage.setItem(STORAGE_KEY_NOT_INTERESTED, JSON.stringify(next));
      } catch (err) {
        console.error('Error undoing not-interested venue:', err);
      }
      return next;
    });
  };

  const isInterested = (venueId: string) => interestedVenueIds.includes(venueId);
  const isNotInterested = (venueId: string) => notInterestedVenueIds.includes(venueId);

  const clearNotInterestedVenues = () => {
    setNotInterestedVenueIds([]);
    try {
      localStorage.removeItem(STORAGE_KEY_NOT_INTERESTED);
    } catch (err) {
      console.error('Error clearing not-interested venues:', err);
    }
  };

  return (
    <BusinessAuthContext.Provider
      value={{
        businessOwner,
        loading,
        inquiries,
        signUp,
        signIn,
        signOut,
        updateProfile,
        addInquiry,
        interestedVenueIds,
        notInterestedVenueIds,
        toggleInterestedVenue,
        markNotInterestedVenue,
        undoNotInterestedVenue,
        isInterested,
        isNotInterested,
        clearNotInterestedVenues
      }}
    >
      {children}
    </BusinessAuthContext.Provider>
  );
};

export const useBusinessAuth = () => {
  const context = useContext(BusinessAuthContext);
  if (!context) {
    throw new Error('useBusinessAuth must be used within a BusinessAuthProvider');
  }
  return context;
};
