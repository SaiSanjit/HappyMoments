import type { Metadata } from "next";
import "./globals.css";
import { CustomerAuthProvider } from "@/contexts/CustomerAuth";
import { VendorAuthProvider } from "@/contexts/VendorAuth";
import { ResourceAuthProvider } from "@/contexts/ResourceAuth";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-body-stack",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono-stack",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-display-stack",
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
      className={`${geist.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
    >
      <body className="font-body antialiased">
        <VendorAuthProvider>
          <ResourceAuthProvider>
            <CustomerAuthProvider>
              {children}
            </CustomerAuthProvider>
          </ResourceAuthProvider>
        </VendorAuthProvider>
      </body>
    </html>
  );
}
