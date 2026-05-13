"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ResourceSession, CRMUserGroup } from "@/lib/crm-types";

interface ResourceAuthContextType {
  resource: ResourceSession | null;
  loading: boolean;
  isAdmin: boolean;
  hasGroup: (group: CRMUserGroup) => boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => void;
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
      const raw = localStorage.getItem("resource_session");
      if (raw) setResource(JSON.parse(raw) as ResourceSession);
    } catch {
      localStorage.removeItem("resource_session");
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    const hash = await hashPassword(password);

    const { data, error } = await supabase
      .from("crm_resources")
      .select("id, vendor_id, resource_name, email, crm_admin, user_groups, is_active")
      .eq("email", email.toLowerCase().trim())
      .eq("password_hash", hash)
      .single();

    if (error || !data) return { error: "Invalid email or password." };
    if (!data.is_active) return { error: "Your account has been deactivated." };

    const session: ResourceSession = {
      resource_id: data.id,
      vendor_id: data.vendor_id,
      resource_name: data.resource_name,
      email: data.email,
      crm_admin: data.crm_admin as 'Y' | 'N',
      user_groups: (data.user_groups || []) as CRMUserGroup[],
    };

    localStorage.setItem("resource_session", JSON.stringify(session));
    setResource(session);

    // Update last_login
    await supabase
      .from("crm_resources")
      .update({ last_login: new Date().toISOString() })
      .eq("id", data.id);

    return { error: null };
  };

  const signOut = () => {
    localStorage.removeItem("resource_session");
    setResource(null);
  };

  const isAdmin = resource?.crm_admin === 'Y';

  const hasGroup = (group: CRMUserGroup) =>
    isAdmin || (resource?.user_groups || []).includes(group);

  return (
    <ResourceAuthContext.Provider value={{ resource, loading, isAdmin, hasGroup, signIn, signOut }}>
      {children}
    </ResourceAuthContext.Provider>
  );
}
