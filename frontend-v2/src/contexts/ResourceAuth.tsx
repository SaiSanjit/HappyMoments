"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ResourceSession, CRMUserGroup } from "@/lib/crm-types";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
const SESSION_KEY = "resource_session";
const REMEMBER_KEY = "resource_remember";

interface ResourceAuthContextType {
  resource: ResourceSession | null;
  loading: boolean;
  isAdmin: boolean;
  hasGroup: (group: CRMUserGroup) => boolean;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<{ error: string | null }>;
  signOut: () => void;
  sendResetOtp: (email: string) => Promise<{ error: string | null }>;
  verifyResetOtp: (email: string, otp: string) => Promise<{ error: string | null }>;
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<{ error: string | null }>;
}

const ResourceAuthContext = createContext<ResourceAuthContextType | undefined>(undefined);

export function useResourceAuth() {
  const ctx = useContext(ResourceAuthContext);
  if (!ctx) throw new Error("useResourceAuth must be used within ResourceAuthProvider");
  return ctx;
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function ResourceAuthProvider({ children }: { children: React.ReactNode }) {
  const [resource, setResource] = useState<ResourceSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY) ?? sessionStorage.getItem(SESSION_KEY);
      if (raw) setResource(JSON.parse(raw) as ResourceSession);
    } catch {
      localStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(SESSION_KEY);
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string, rememberMe = false) => {
    const hash = await hashPassword(password);

    const { data, error } = await supabase
      .rpc("verify_resource", { p_email: email, p_password_hash: hash });

    if (error || !data || data.length === 0) return { error: "Invalid email or password." };
    const row = data[0];

    const session: ResourceSession = {
      resource_id: row.id,
      vendor_id: row.vendor_id,
      resource_name: row.resource_name,
      email: row.email,
      crm_admin: row.crm_admin as 'Y' | 'N',
      user_groups: (row.user_groups || []) as CRMUserGroup[],
    };

    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(SESSION_KEY, JSON.stringify(session));
    if (rememberMe) localStorage.setItem(REMEMBER_KEY, "1");
    setResource(session);

    await supabase
      .from("crm_resources")
      .update({ last_login: new Date().toISOString() })
      .eq("id", row.id);

    return { error: null };
  };

  const signOut = () => {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(REMEMBER_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    setResource(null);
  };

  const sendResetOtp = async (email: string) => {
    const res = await fetch(`${API}/api/email/send-resource-reset-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.toLowerCase().trim() }),
    });
    const data = await res.json();
    if (!data.success) return { error: data.message || "Failed to send reset code" };
    return { error: null };
  };

  const verifyResetOtp = async (email: string, otp: string) => {
    const res = await fetch(`${API}/api/email/verify-resource-reset-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.toLowerCase().trim(), otp }),
    });
    const data = await res.json();
    if (!data.success) return { error: data.message || "Invalid code" };
    return { error: null };
  };

  const resetPassword = async (email: string, otp: string, newPassword: string) => {
    const res = await fetch(`${API}/api/resources/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.toLowerCase().trim(), otp, newPassword }),
    });
    const data = await res.json();
    if (!data.success) return { error: data.message || "Failed to reset password" };
    return { error: null };
  };

  const isAdmin = resource?.crm_admin === 'Y';

  const hasGroup = (group: CRMUserGroup) =>
    isAdmin || (resource?.user_groups || []).includes(group);

  return (
    <ResourceAuthContext.Provider value={{ resource, loading, isAdmin, hasGroup, signIn, signOut, sendResetOtp, verifyResetOtp, resetPassword }}>
      {children}
    </ResourceAuthContext.Provider>
  );
}
