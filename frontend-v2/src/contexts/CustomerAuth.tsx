"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase, Customer } from "@/lib/supabase";

interface AuthState {
  customer: Customer | null;
  loading: boolean;
}

interface CustomerAuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ customer: Customer | null; error: string | null }>;
  signUp: (name: string, email: string, password: string, mobile: string) => Promise<{ error: string | null }>;
  signOut: () => void;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export function useCustomerAuth() {
  const ctx = useContext(CustomerAuthContext);
  if (!ctx) throw new Error("useCustomerAuth must be used within CustomerAuthProvider");
  return ctx;
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
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
    const hash = await hashPassword(password);
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("email", email.toLowerCase().trim())
      .eq("password_hash", hash)
      .single();

    if (error || !data) return { customer: null, error: "Invalid email or password." };

    const c = data as Customer;
    localStorage.setItem("customer_id", String(c.id));
    setCustomer(c);
    return { customer: c, error: null };
  };

  const signUp = async (name: string, email: string, password: string, mobile: string) => {
    const hash = await hashPassword(password);
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

  return (
    <CustomerAuthContext.Provider value={{ customer, loading, signIn, signUp, signOut }}>
      {children}
    </CustomerAuthContext.Provider>
  );
}
