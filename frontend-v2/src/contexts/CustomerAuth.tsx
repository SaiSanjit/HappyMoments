"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase, Customer } from "@/lib/supabase";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

interface AuthState {
  customer: Customer | null;
  loading: boolean;
}

interface CustomerAuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ customer: Customer | null; error: string | null }>;
  signUp: (name: string, email: string, password: string, mobile: string) => Promise<{ error: string | null }>;
  signOut: () => void;
  sendResetOtp: (email: string) => Promise<{ error: string | null }>;
  verifyResetOtp: (email: string, otp: string) => Promise<{ error: string | null }>;
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<{ error: string | null }>;
  updateProfile: (updates: Partial<Pick<Customer, "full_name" | "mobile_number" | "location">>) => Promise<{ error: string | null }>;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export function useCustomerAuth() {
  const ctx = useContext(CustomerAuthContext);
  if (!ctx) throw new Error("useCustomerAuth must be used within CustomerAuthProvider");
  return ctx;
}

function encodePassword(password: string): string {
  return btoa(password);
}

export function CustomerAuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = localStorage.getItem("customer_id");
    if (!id) { setLoading(false); return; }

    supabase
      .from("customers")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (data && !error) setCustomer(data as Customer);
        else localStorage.removeItem("customer_id");
        setLoading(false);
      });
  }, []);

  const signIn = async (email: string, password: string) => {
    const hash = encodePassword(password);
    const { data, error } = await supabase
      .rpc("verify_customer", { p_email: email.toLowerCase().trim(), p_password_hash: hash });

    if (error || !data || data.length === 0) return { customer: null, error: "Invalid email or password." };
    const data0 = data[0];

    const c = data0 as Customer;
    localStorage.setItem("customer_id", String(c.id));
    setCustomer(c);
    return { customer: c, error: null };
  };

  const signUp = async (name: string, email: string, password: string, mobile: string) => {
    const hash = encodePassword(password);
    const { error } = await supabase.from("customers").insert({
      full_name: name,
      email: email.toLowerCase().trim(),
      password_hash: hash,
      mobile_number: mobile,
      status: "verified",
      login_count: 0,
    });
    if (error) return { error: error.message };
    return { error: null };
  };

  const signOut = () => {
    localStorage.removeItem("customer_id");
    setCustomer(null);
  };

  const sendResetOtp = async (email: string) => {
    const res = await fetch(`${API}/api/email/send-customer-reset-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.toLowerCase().trim() }),
    });
    const data = await res.json();
    if (!data.success) return { error: data.message || "Failed to send reset code" };
    return { error: null };
  };

  const verifyResetOtp = async (email: string, otp: string) => {
    const res = await fetch(`${API}/api/email/verify-customer-reset-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.toLowerCase().trim(), otp }),
    });
    const data = await res.json();
    if (!data.success) return { error: data.message || "Invalid code" };
    return { error: null };
  };

  const resetPassword = async (email: string, otp: string, newPassword: string) => {
    const res = await fetch(`${API}/api/customers/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.toLowerCase().trim(), otp, newPassword }),
    });
    const data = await res.json();
    if (!data.success) return { error: data.message || "Failed to reset password" };
    return { error: null };
  };

  const updateProfile = async (updates: Partial<Pick<Customer, "full_name" | "mobile_number" | "location">>) => {
    if (!customer) return { error: "Not signed in" };
    const { error } = await supabase
      .from("customers")
      .update(updates)
      .eq("id", customer.id);
    if (error) return { error: error.message };
    setCustomer({ ...customer, ...updates });
    return { error: null };
  };

  return (
    <CustomerAuthContext.Provider value={{ customer, loading, signIn, signUp, signOut, sendResetOtp, verifyResetOtp, resetPassword, updateProfile }}>
      {children}
    </CustomerAuthContext.Provider>
  );
}
