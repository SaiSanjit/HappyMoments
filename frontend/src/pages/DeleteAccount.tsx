import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Shield, Trash2, Mail, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DeleteAccount: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <Header />

      <main className="flex-1 container max-w-3xl mx-auto px-4 py-10 md:py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200/80 p-6 md:p-10">
          {/* Header */}
          <div className="border-b border-neutral-200 pb-6 mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold uppercase tracking-wider mb-3">
              <Shield className="w-3.5 h-3.5" />
              <span>Google Play Data Safety</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">
              Account and Data Deletion Request
            </h1>
            <p className="text-neutral-500 text-sm mt-1">
              App: <strong>Happy Moments</strong> (<code className="text-xs bg-neutral-100 px-1.5 py-0.5 rounded">com.happymoments.app</code>)
            </p>
          </div>

          <div className="space-y-6 text-neutral-700 text-sm leading-relaxed">
            <p>
              At <strong>Happy Moments</strong>, we respect your privacy and provide you full control over your personal data. 
              In compliance with Google Play&apos;s User Data policy and global privacy standards, you can request the permanent deletion of your account and all associated personal data at any time.
            </p>

            {/* How to request deletion */}
            <div className="bg-orange-50/60 border border-orange-200/80 rounded-xl p-5">
              <h2 className="text-base font-semibold text-neutral-900 flex items-center gap-2 mb-3">
                <Trash2 className="w-4 h-4 text-orange-600" />
                How to Request Account Deletion
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-neutral-700">
                <li>
                  Send an email to our privacy team at{' '}
                  <a href="mailto:happymomentsforindia@gmail.com" className="text-orange-600 font-semibold hover:underline">
                    happymomentsforindia@gmail.com
                  </a>
                </li>
                <li>
                  Subject line: <strong>&ldquo;Account and Data Deletion Request - Happy Moments&rdquo;</strong>
                </li>
                <li>
                  Include your <strong>registered email address</strong> and <strong>mobile number</strong>.
                </li>
                <li>
                  Mention whether your account is a <strong>Customer</strong> account or a <strong>Vendor</strong> account.
                </li>
              </ol>

              <div className="mt-4">
                <a
                  href="mailto:happymomentsforindia@gmail.com?subject=Account%20and%20Data%20Deletion%20Request%20-%20Happy%20Moments&body=Hello%20Happy%20Moments%20Team,%0A%0APlease%20permanently%20delete%20my%20account%20and%20all%20associated%20personal%20data%20from%20Happy%20Moments.%0A%0AMy%20Registered%20Email:%20%0AMy%20Registered%20Phone:%20%0AAccount%20Type%20(Customer/Vendor):%20%0A%0AThank%20you."
                >
                  <Button className="bg-orange-600 hover:bg-orange-700 text-white gap-2">
                    <Mail className="w-4 h-4" />
                    Send Deletion Email
                  </Button>
                </a>
              </div>
            </div>

            {/* Types of data deleted */}
            <div>
              <h2 className="text-base font-semibold text-neutral-900 flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                Types of Data That Will Be Deleted
              </h2>
              <ul className="list-disc list-inside space-y-1 text-neutral-600 pl-2">
                <li><strong>Account details:</strong> Name, email address, password hash, and contact numbers.</li>
                <li><strong>Customer preferences:</strong> Saved search filters, vendor bookmarks, and event criteria.</li>
                <li><strong>Inquiry history:</strong> Quotation requests, vendor messages, and customer dashboard records.</li>
                <li><strong>Vendor portfolio (for vendors):</strong> Business profile, images, pricing, and package details.</li>
              </ul>
            </div>

            {/* Data retained */}
            <div>
              <h2 className="text-base font-semibold text-neutral-900 flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Data Retained & Retention Period
              </h2>
              <ul className="list-disc list-inside space-y-1 text-neutral-600 pl-2">
                <li>
                  <strong>Billing & Tax Records:</strong> If invoices or transactions were processed, statutory records may be retained as required by applicable tax and commercial laws.
                </li>
                <li>
                  <strong>Security Logs:</strong> Server activity logs are automatically purged after 90 days.
                </li>
              </ul>
            </div>

            {/* Processing timeline */}
            <div className="flex items-start gap-3 bg-neutral-100/70 p-4 rounded-xl border border-neutral-200">
              <Clock className="w-5 h-5 text-neutral-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-neutral-900">Processing Timeline</p>
                <p className="text-xs text-neutral-600 mt-0.5">
                  Your request is acknowledged within 72 hours, and all personal data is permanently wiped from active servers within 30 days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DeleteAccount;
