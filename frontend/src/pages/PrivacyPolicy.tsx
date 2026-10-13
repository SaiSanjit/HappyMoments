import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Shield, Lock, Eye, FileText, Phone, Mail, CheckCircle2 } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <Header />

      <main className="flex-1 container max-w-4xl mx-auto px-4 py-10 md:py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200/80 p-6 md:p-12">
          {/* Header */}
          <div className="border-b border-neutral-200 pb-8 mb-8 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-medium mb-4">
              <Shield className="w-4 h-4" />
              <span>Official Privacy Policy</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight">
              Privacy Policy for Happy Moments
            </h1>
            <p className="text-neutral-500 mt-2 text-sm">
              Last updated: October 11, 2026 | Effective Date: October 11, 2026
            </p>
          </div>

          <div className="prose prose-neutral max-w-none space-y-8 text-neutral-700 leading-relaxed">
            {/* Introduction */}
            <section>
              <h2 className="text-xl font-semibold text-neutral-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-500" />
                1. Introduction
              </h2>
              <p className="mt-3">
                Welcome to <strong>Happy Moments</strong> (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), accessible via our website at{' '}
                <a href="https://happymomentsindia.com" className="text-orange-600 hover:underline">
                  https://happymomentsindia.com
                </a>{' '}
                and our Happy Moments mobile application available on the Google Play Store.
              </p>
              <p className="mt-2">
                We are committed to protecting your privacy and ensuring your personal information is handled in a safe and responsible manner. This Privacy Policy outlines what information we collect, how we use it, and your rights concerning your personal data.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-xl font-semibold text-neutral-900 flex items-center gap-2">
                <Eye className="w-5 h-5 text-orange-500" />
                2. Information We Collect
              </h2>
              <p className="mt-3">We collect information to provide better event planning, vendor discovery, and communication services:</p>

              <div className="mt-4 space-y-4">
                <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                  <h3 className="font-semibold text-neutral-900">A. Personal Information You Provide</h3>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-neutral-600">
                    <li><strong>Account & Profile Data:</strong> Name, email address, phone number, location, and login credentials when you sign up as a customer or vendor.</li>
                    <li><strong>Vendor Portfolio Information:</strong> Business name, services offered, packages, pricing, catalog images, and business address.</li>
                    <li><strong>Event Inquiries & Quotations:</strong> Event dates, budget, guest count, and service preferences submitted for vendor bookings.</li>
                  </ul>
                </div>

                <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                  <h3 className="font-semibold text-neutral-900">B. Device & App Permissions</h3>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-neutral-600">
                    <li><strong>Camera & Photo Gallery:</strong> Used only when you choose to take or upload photos for vendor portfolios, catalogs, or event spaces.</li>
                    <li><strong>Microphone / Audio:</strong> Used exclusively when you use our interactive voice search feature (Smart Voice Request) to convert speech to search queries. Voice data is processed solely for search matching and is not stored permanently.</li>
                    <li><strong>Network & Internet:</strong> Required to connect to our servers, retrieve listings, and send inquiries.</li>
                  </ul>
                </div>

                <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                  <h3 className="font-semibold text-neutral-900">C. Usage & Technical Data</h3>
                  <p className="text-sm text-neutral-600 mt-1">
                    Device model, operating system version, browser type, and anonymous crash logs to ensure high reliability and app stability.
                  </p>
                </div>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section>
              <h2 className="text-xl font-semibold text-neutral-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-orange-500" />
                3. How We Use Your Information
              </h2>
              <ul className="list-disc list-inside mt-3 space-y-2 text-neutral-700">
                <li>To facilitate connections and quotations between customers and event vendors (decorators, photographers, venues).</li>
                <li>To send booking notifications, verification OTPs, and service updates via email or SMS.</li>
                <li>To personalize event recommendations and vendor searches.</li>
                <li>To maintain the safety, integrity, and security of our platform.</li>
                <li>To comply with applicable legal obligations and resolve disputes.</li>
              </ul>
            </section>

            {/* Sharing of Information */}
            <section>
              <h2 className="text-xl font-semibold text-neutral-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-orange-500" />
                4. Data Sharing and Disclosure
              </h2>
              <p className="mt-3">We respect your privacy and do <strong>not sell, rent, or trade</strong> your personal information to third parties. We only share information in the following circumstances:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-neutral-700">
                <li><strong>With Selected Vendors:</strong> When you express interest or request a quotation, your contact details are shared with the relevant vendor to fulfill your inquiry.</li>
                <li><strong>Service Providers:</strong> Secure database, cloud storage, and email delivery providers (e.g., Supabase, Google Cloud) that adhere to strict data protection standards.</li>
                <li><strong>Legal Requirements:</strong> If required by law, regulation, or legal process.</li>
              </ul>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-xl font-semibold text-neutral-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-orange-500" />
                5. Data Security & Storage
              </h2>
              <p className="mt-3">
                We implement industry-standard administrative, technical, and physical security measures, including HTTPS/TLS encryption for all data in transit, to protect your personal information against unauthorized access, alteration, or disclosure.
              </p>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-xl font-semibold text-neutral-900">
                6. Children&apos;s Privacy
              </h2>
              <p className="mt-3">
                Happy Moments does not knowingly collect or solicit personal data from children under the age of 13. If we discover that a child under 13 has provided us with personal information, we will delete such information promptly.
              </p>
            </section>

            {/* Your Rights and Data Deletion */}
            <section>
              <h2 className="text-xl font-semibold text-neutral-900">
                7. Your Rights & Account Deletion
              </h2>
              <p className="mt-3">
                You have the right to access, correct, or delete your personal data. You may request account deletion or data removal at any time by visiting our{' '}
                <a href="/delete-account" className="text-orange-600 font-medium hover:underline">
                  Account Deletion Request Page
                </a>{' '}
                or emailing us directly at{' '}
                <a href="mailto:happymomentsforindia@gmail.com" className="text-orange-600 font-medium hover:underline">
                  happymomentsforindia@gmail.com
                </a>
                . We will fulfill verified deletion requests within 30 days.
              </p>
            </section>

            {/* Contact Information */}
            <section className="bg-orange-50/70 border border-orange-200/60 p-6 rounded-2xl mt-8">
              <h2 className="text-xl font-semibold text-neutral-900">
                8. Contact Us
              </h2>
              <p className="mt-2 text-neutral-700 text-sm">
                If you have questions, feedback, or concerns regarding this Privacy Policy or our data practices, please reach out to us:
              </p>
              <div className="mt-4 space-y-2 text-sm text-neutral-800">
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-orange-600" />
                  <strong>Email:</strong>{' '}
                  <a href="mailto:happymomentsforindia@gmail.com" className="text-orange-700 hover:underline">
                    happymomentsforindia@gmail.com
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-orange-600" />
                  <strong>Platform:</strong> Happy Moments Event Management
                </p>
                <p className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-orange-600" />
                  <strong>Website:</strong>{' '}
                  <a href="https://happymomentsindia.com" className="text-orange-700 hover:underline" target="_blank" rel="noreferrer">
                    https://happymomentsindia.com
                  </a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
