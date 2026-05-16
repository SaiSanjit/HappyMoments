# Customer Auth → Supabase Auth Migration

## Why

Current customer auth is a custom layer: SHA-256 password hashes in a plain `customers` table, verified via a Postgres RPC. Problems:
- SHA-256 is not a password hashing algorithm — it's GPU-crackable
- No email verification (status hardcoded to `"verified"` at insert)
- localStorage session has no expiry or rotation
- Custom `verify_customer` RPC is a maintenance burden

Supabase Auth gives bcrypt hashing, JWT sessions with auto-refresh, email verification, and password reset — all built-in and already in the SDK (vendors use it for OTP and OAuth).

---

## What Changes

| Before | After |
|---|---|
| `customers.password_hash` column | Removed |
| `verify_customer` RPC | Removed |
| `supabase.rpc("verify_customer")` | `supabase.auth.signInWithPassword()` |
| `supabase.from("customers").insert()` | `supabase.auth.signUp()` + trigger to insert profile row |
| `localStorage.setItem("customer_id", ...)` | `supabase.auth.getSession()` + `onAuthStateChange` |
| Manual session restore on page load | Supabase SDK handles automatically |

---

## Step 1 — Supabase Dashboard: Enable Email Auth

1. Go to **Authentication → Providers → Email**
2. Enable **Email/Password** sign-in
3. Optionally enable **Confirm email** (sends a verification link — recommended)

---

## Step 2 — Database: Add `user_id` to `customers` Table

Run this in Supabase SQL Editor:

```sql
-- Add auth user reference to customers table
ALTER TABLE customers
  ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Make it unique (one auth user = one customer profile)
ALTER TABLE customers
  ADD CONSTRAINT customers_user_id_unique UNIQUE (user_id);

-- Index for fast lookups
CREATE INDEX customers_user_id_idx ON customers(user_id);
```

---

## Step 3 — Database: Auto-create Customer Profile on Sign-Up

Instead of inserting into `customers` manually, use a trigger so that when Supabase Auth creates a user, the profile row is created automatically.

```sql
CREATE OR REPLACE FUNCTION handle_new_customer()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO customers (user_id, email, full_name, mobile_number, status, login_count)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'mobile_number', ''),
    'unverified',  -- use Supabase email confirmation to flip this
    0
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  WHEN (NEW.raw_user_meta_data->>'user_type' = 'customer')
  EXECUTE FUNCTION handle_new_customer();
```

> The `user_type = 'customer'` guard prevents vendor OAuth sign-ups from also creating a customer row.

---

## Step 4 — Database: RLS Policies

Replace any permissive policies on `customers` with auth-aware ones:

```sql
-- Enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Customers can only read/update their own row
CREATE POLICY "customers_select_own" ON customers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "customers_update_own" ON customers
  FOR UPDATE USING (auth.uid() = user_id);

-- No direct inserts from client — trigger handles it
-- Service role can still insert (trigger runs as SECURITY DEFINER)
```

---

## Step 5 — Drop Old Auth Columns and RPC

After confirming migration works end-to-end:

```sql
-- Remove password column (Supabase Auth owns passwords now)
ALTER TABLE customers DROP COLUMN password_hash;

-- Drop the verify RPC
DROP FUNCTION IF EXISTS verify_customer(text, text);
```

> Do this last, after testing in staging.

---

## Step 6 — Update `CustomerAuth.tsx`

Replace the entire context with the Supabase Auth version:

```tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase, Customer } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

interface AuthState {
  customer: Customer | null;
  session: Session | null;
  loading: boolean;
}

interface CustomerAuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (name: string, email: string, password: string, mobile: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export function useCustomerAuth() {
  const ctx = useContext(CustomerAuthContext);
  if (!ctx) throw new Error("useCustomerAuth must be used within CustomerAuthProvider");
  return ctx;
}

export function CustomerAuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadCustomer(userId: string) {
    const { data } = await supabase
      .from("customers")
      .select("*")
      .eq("user_id", userId)
      .single();
    setCustomer(data ?? null);
  }

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) loadCustomer(session.user.id).finally(() => setLoading(false));
      else setLoading(false);
    });

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) loadCustomer(session.user.id);
      else setCustomer(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password,
    });
    if (error) return { error: "Invalid email or password." };
    return { error: null };
  };

  const signUp = async (name: string, email: string, password: string, mobile: string) => {
    const { error } = await supabase.auth.signUp({
      email: email.toLowerCase().trim(),
      password,
      options: {
        data: {
          full_name: name,
          mobile_number: mobile,
          user_type: "customer",  // used by the DB trigger guard
        },
      },
    });
    if (error) return { error: error.message };
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <CustomerAuthContext.Provider value={{ customer, session, loading, signIn, signUp, signOut }}>
      {children}
    </CustomerAuthContext.Provider>
  );
}
```

Key changes from old version:
- No `hashPassword` — Supabase handles bcrypt server-side
- No `localStorage` — SDK persists the JWT automatically
- `customer` is loaded by `user_id` (not a numeric `id`)
- `signOut` is async (awaits Supabase SDK)
- `session` exposed in context for components that need the JWT (e.g. API calls)

---

## Step 7 — Update `auth/page.tsx` (Sign-Up Success Message)

When email confirmation is enabled, sign-up succeeds but the user must verify their email before they can log in. Update the success message:

```tsx
setSuccess("Check your email for a confirmation link before signing in.");
```

---

## Step 8 — Update `Customer` Type in `supabase.ts`

Add `user_id` to the Customer interface and remove `password_hash`:

```ts
export interface Customer {
  id: number;
  user_id: string;        // ← new: links to auth.users
  full_name: string;
  email: string;
  // password_hash removed — owned by Supabase Auth
  mobile_number: string;
  location?: string;
  status: 'unverified' | 'verified';
  created_at: string;
}
```

---

## Existing Accounts — Migration Strategy

Existing customer passwords are SHA-256 hashes. **They cannot be converted to bcrypt.** Options:

**Option A — Password Reset (simplest)**
Send all existing customers a "reset your password" email via Supabase Auth:
```ts
await supabase.auth.resetPasswordForEmail(customerEmail)
```
Create Supabase Auth users for them first (via service role API or a one-time script), then force a reset.

**Option B — Side-by-side (gradual)**
Keep the old `verify_customer` RPC temporarily. On login:
1. Try `signInWithPassword` first
2. If user not found in Auth, fall back to old RPC, then create their Auth account and prompt them to set a new password

**Option C — Re-register (simplest for early stage)**
If there are very few customers in production, just let them sign up again. Drop the old data after a grace period.

For a pre-launch app, **Option C** is cleanest.

---

## Checklist

- [ ] Enable Email/Password in Supabase Auth dashboard
- [ ] Run Step 2 SQL (add `user_id` column)
- [ ] Run Step 3 SQL (create trigger)
- [ ] Run Step 4 SQL (RLS policies)
- [ ] Update `CustomerAuth.tsx` (Step 6)
- [ ] Update `Customer` type in `supabase.ts` (Step 8)
- [ ] Update sign-up success message in `auth/page.tsx` (Step 7)
- [ ] Test sign-up → email confirmation → sign-in → sign-out flow end-to-end
- [ ] Handle existing accounts (Option A / B / C above)
- [ ] Run Step 5 SQL to drop `password_hash` and `verify_customer` RPC
