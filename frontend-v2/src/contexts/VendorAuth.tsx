"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { VendorSession } from "@/lib/crm-types";

interface VendorAuthContextType {
  vendor: VendorSession | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<void>;
  sendOTP: (email: string) => Promise<{ error: string | null }>;
  verifyOTP: (email: string, token: string) => Promise<{ error: string | null }>;
  handleOAuthCallback: () => Promise<{ error: string | null }>;
  signOut: () => void;
}

const VendorAuthContext = createContext<VendorAuthContextType | undefined>(undefined);

export function useVendorAuth() {
  const ctx = useContext(VendorAuthContext);
  if (!ctx) throw new Error("useVendorAuth must be used within VendorAuthProvider");
  return ctx;
}

async function fetchVendorByEmail(email: string): Promise<VendorSession | null> {
  const { data } = await supabase
    .from("vendors")
    .select("vendor_id, brand_name, email, spoc_name")
    .ilike("email", email.trim())
    .single();

  if (!data) return null;
  return {
    vendor_id: data.vendor_id,
    brand_name: data.brand_name,
    email: data.email || "",
    spoc_name: data.spoc_name || "",
  };
}

export function VendorAuthProvider({ children }: { children: React.ReactNode }) {
  const [vendor, setVendor] = useState<VendorSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("vendor_session");
      if (raw) setVendor(JSON.parse(raw) as VendorSession);
    } catch {
      localStorage.removeItem("vendor_session");
    }
    setLoading(false);
  }, []);

  const saveSession = (session: VendorSession) => {
    localStorage.setItem("vendor_session", JSON.stringify(session));
    setVendor(session);
  };

  const signIn = async (email: string, password: string) => {
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (authError) return { error: "Invalid email or password." };

    const vendorSession = await fetchVendorByEmail(email);
    if (!vendorSession) return { error: "No vendor account found for this email." };

    saveSession(vendorSession);
    return { error: null };
  };

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/vendor/auth/callback`,
      },
    });
  };

  const sendOTP = async (email: string) => {
    const vendorSession = await fetchVendorByEmail(email);
    if (!vendorSession) return { error: "No vendor account found with this email address." };

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        shouldCreateUser: false,
        emailRedirectTo: `${window.location.origin}/vendor/auth/callback`,
      },
    });

    if (error) return { error: error.message };
    return { error: null };
  };

  const verifyOTP = async (email: string, token: string) => {
    const { error } = await supabase.auth.verifyOtp({
      email: email.trim().toLowerCase(),
      token: token.trim(),
      type: "email",
    });

    if (error) return { error: "Invalid or expired OTP. Please try again." };

    const vendorSession = await fetchVendorByEmail(email);
    if (!vendorSession) return { error: "Vendor account not found for this email." };

    saveSession(vendorSession);
    return { error: null };
  };

  const handleOAuthCallback = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) return { error: "Authentication failed. Please try again." };

    const userEmail = session.user.email;
    if (!userEmail) return { error: "Could not retrieve email from Google account." };

    const vendorSession = await fetchVendorByEmail(userEmail);
    if (!vendorSession) {
      return { error: "No vendor account is linked to this Google account. Please contact support or sign in with your username." };
    }

    saveSession(vendorSession);
    return { error: null };
  };

  const signOut = () => {
    localStorage.removeItem("vendor_session");
    setVendor(null);
  };

  return (
    <VendorAuthContext.Provider value={{ vendor, loading, signIn, signInWithGoogle, sendOTP, verifyOTP, handleOAuthCallback, signOut }}>
      {children}
    </VendorAuthContext.Provider>
  );
}
