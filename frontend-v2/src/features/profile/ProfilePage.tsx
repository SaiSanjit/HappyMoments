"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { ToastContainer, useToast } from "@/components/ui/Toast";
import ProfileTopBar from "./components/ProfileTopBar";
import GallerySection from "./components/GallerySection";
import BasicsSection from "./components/BasicsSection";
import StorySection from "./components/StorySection";
import ContactSection from "./components/ContactSection";
import BusinessSection from "./components/BusinessSection";
import PackagesSection from "./components/PackagesSection";
import ProfileHealthSidebar from "./components/ProfileHealthSidebar";
import AnalyticsSidebar from "./components/AnalyticsSidebar";

export interface PackageItem {
  name: string;
  price?: number;
  description?: string;
  inclusions?: string[];
}

export interface CatalogImage {
  id: string;
  size: number;
  title: string;
  filename: string;
  media_url: string;
  created_at: string;
  is_highlighted: boolean;
}

export interface AdditionalInfo {
  tagline?: string;
  website?: string;
  team_size?: string;
  awards?: string[];
  service_areas?: string[];
  working_hours?: string;
  certifications?: string[];
  custom_fields?: unknown[];
}

export interface VendorProfile {
  vendor_id: number;
  slug: string;
  // Basics
  brand_name: string;
  categories: string[];
  address: string;
  languages: string[];
  instagram: string;
  additional_info: AdditionalInfo;
  // Story — quick_intro shows on public page; description is secondary
  quick_intro: string;
  description: string;
  // Contact
  spoc_name: string;
  phone_number: string;
  whatsapp_number: string;
  alternate_number: string;
  google_maps_link: string;
  // Business stats
  experience: string;
  events_completed: number;
  starting_price: number;
  // Packages
  packages: PackageItem[];
  // Gallery
  catalog_images_metadata: CatalogImage[];
  // Meta
  verified: boolean;
  updated_at: string;
}

interface Props {
  vendorId: string;
}

export default function ProfilePage({ vendorId }: Props) {
  const { toasts, toast, dismiss } = useToast();
  const [draft, setDraft] = useState<VendorProfile | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!vendorId) return;
    (async () => {
      const { data: v } = await supabase
        .from("vendors")
        .select("*")
        .eq("vendor_id", vendorId)
        .single();
      if (v) {
        setDraft({
          ...v,
          quick_intro: v.quick_intro ?? "",
          description: v.description ?? "",
          categories: Array.isArray(v.categories) ? v.categories : [],
          languages: Array.isArray(v.languages) ? v.languages : [],
          packages: Array.isArray(v.packages) ? v.packages : [],
          catalog_images_metadata: Array.isArray(v.catalog_images_metadata)
            ? v.catalog_images_metadata
            : [],
          additional_info: v.additional_info ?? {},
          spoc_name: v.spoc_name ?? "",
          phone_number: v.phone_number ?? "",
          whatsapp_number: v.whatsapp_number ?? "",
          alternate_number: v.alternate_number ?? "",
          google_maps_link: v.google_maps_link ?? "",
          experience: v.experience ?? "",
          events_completed: v.events_completed ?? 0,
          starting_price: v.starting_price ?? 0,
          instagram: v.instagram ?? "",
        });
      }
      setLoading(false);
    })();
  }, [vendorId]);

  const updateDraft = useCallback(
    <K extends keyof VendorProfile>(key: K, value: VendorProfile[K]) => {
      setDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
      setIsDirty(true);
    },
    []
  );

  const updateAdditionalInfo = useCallback(
    (key: keyof AdditionalInfo, value: string) => {
      setDraft((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          additional_info: { ...(prev.additional_info ?? {}), [key]: value },
        };
      });
      setIsDirty(true);
    },
    []
  );

  const handleSave = async () => {
    if (!draft || !isDirty) return;
    setIsSaving(true);
    const { error } = await supabase
      .from("vendors")
      .update({
        brand_name: draft.brand_name,
        categories: draft.categories,
        address: draft.address,
        languages: draft.languages,
        instagram: draft.instagram,
        additional_info: draft.additional_info,
        quick_intro: draft.quick_intro,
        description: draft.description,
        spoc_name: draft.spoc_name,
        phone_number: draft.phone_number,
        whatsapp_number: draft.whatsapp_number,
        alternate_number: draft.alternate_number,
        google_maps_link: draft.google_maps_link,
        experience: draft.experience,
        events_completed: draft.events_completed || null,
        starting_price: draft.starting_price || null,
        packages: draft.packages,
        catalog_images_metadata: draft.catalog_images_metadata,
        updated_at: new Date().toISOString(),
      })
      .eq("vendor_id", vendorId);
    setIsSaving(false);
    if (error) {
      toast("error", "Save failed", "Failed to save changes. Please try again.");
    } else {
      setIsDirty(false);
      toast("success", "Saved", "Profile published successfully.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div
          className="h-7 w-7 animate-spin rounded-full border-2"
          style={{ borderColor: "var(--gold)", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  if (!draft) return null;

  return (
    <div className="min-h-full" style={{ background: "var(--bg)" }}>
      <ProfileTopBar
        draft={draft}
        isDirty={isDirty}
        isSaving={isSaving}
        onSave={handleSave}
      />

      <div className="mx-auto max-w-[1120px] px-6 pb-16 pt-6 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
        {/* Main editing column */}
        <div className="flex flex-col gap-5">
          <GallerySection
            images={draft.catalog_images_metadata}
            vendorId={vendorId}
            onChange={(imgs) => updateDraft("catalog_images_metadata", imgs)}
          />
          <BasicsSection
            draft={draft}
            onChange={updateDraft}
            onAdditionalInfoChange={updateAdditionalInfo}
          />
          <StorySection
            quickIntro={draft.quick_intro}
            description={draft.description}
            onChangeQuickIntro={(v) => updateDraft("quick_intro", v)}
            onChangeDescription={(v) => updateDraft("description", v)}
          />
          <ContactSection draft={draft} onChange={updateDraft} />
          <BusinessSection draft={draft} onChange={updateDraft} />
          <PackagesSection
            packages={draft.packages}
            onChange={(v) => updateDraft("packages", v)}
          />
        </div>

        {/* Sticky sidebar */}
        <div className="flex flex-col gap-4 lg:sticky lg:top-6">
          <ProfileHealthSidebar draft={draft} />
          <AnalyticsSidebar vendorId={vendorId} />
        </div>
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
