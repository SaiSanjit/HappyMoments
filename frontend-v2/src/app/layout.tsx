import type { Metadata } from "next";
import "./globals.css";
import { CustomerAuthProvider } from "@/contexts/CustomerAuth";
import { VendorAuthProvider } from "@/contexts/VendorAuth";
import { ResourceAuthProvider } from "@/contexts/ResourceAuth";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ThemeToggle from "@/components/shared/ThemeToggle";
import {
  Cormorant_Garamond,
  DM_Sans,
  DM_Mono,
  Figtree,
} from "next/font/google";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body-stack",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display-stack",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-mono-stack",
  display: "swap",
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-ui-stack",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Happy Moments | Premium Event Vendor Marketplace",
  description:
    "Discover verified photographers, venues, planners, caterers, and luxury event vendors with Happy Moments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${dmSans.variable} ${cormorant.variable} ${dmMono.variable} ${figtree.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider>
          <VendorAuthProvider>
            <ResourceAuthProvider>
              <CustomerAuthProvider>
                {children}
              </CustomerAuthProvider>
            </ResourceAuthProvider>
          </VendorAuthProvider>
          <ThemeToggle />
        </ThemeProvider>
      </body>
    </html>
  );
}
