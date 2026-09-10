import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useBusinessAuth } from '@/contexts/BusinessAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Eye, EyeOff, UserPlus, Sparkles, Building2 } from 'lucide-react';

const BusinessSignup: React.FC = () => {
  const navigate = useNavigate();
  const { signUp } = useBusinessAuth();

  const [signupData, setSignupData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    mobileNumber: '',
    businessType: 'Retail / D2C Brand' as any,
    city: 'Hyderabad',
    websiteUrl: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupData.fullName.trim() || !signupData.companyName.trim() || !signupData.email.trim() || !signupData.mobileNumber.trim()) {
      setError('All fields marked * are required');
      return;
    }
    const cleanPhone = signupData.mobileNumber.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setError('Mobile / WhatsApp number is mandatory and must be at least 10 digits.');
      return;
    }
    if (signupData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');
    const res = await signUp({
      fullName: signupData.fullName,
      companyName: signupData.companyName,
      email: signupData.email,
      mobileNumber: signupData.mobileNumber,
      businessType: signupData.businessType,
      city: signupData.city,
      websiteUrl: signupData.websiteUrl,
      password: signupData.password
    });
    setLoading(false);

    if (res.success) {
      navigate('/business-dashboard');
    } else {
      setError(res.error || 'Failed to register business');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/business" className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-orange-600 mb-4 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          Back to Business Portal
        </Link>
        <div className="flex items-center justify-center space-x-2">
          <span className="text-2xl font-black bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
            HappyMoments
          </span>
          <Badge className="bg-orange-100 text-orange-700 font-bold border-none text-xs">
            BUSINESS
          </Badge>
        </div>
        <h2 className="mt-4 text-3xl font-black text-slate-900 tracking-tight">
          Register Your Business
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Book launch auditoriums, exhibition stalls, and mall kiosks.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg px-4">
        <Card className="border-slate-200 shadow-md bg-white">
          <CardContent className="pt-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">Contact Full Name *</Label>
                  <Input 
                    placeholder="e.g. Vikram Sharma"
                    value={signupData.fullName}
                    onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                    className="text-sm rounded-lg"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">Company / Brand Name *</Label>
                  <Input 
                    placeholder="e.g. Aura Innovations"
                    value={signupData.companyName}
                    onChange={(e) => setSignupData({ ...signupData, companyName: e.target.value })}
                    className="text-sm rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">Business Email *</Label>
                  <Input 
                    type="email"
                    placeholder="vikram@company.com"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    className="text-sm rounded-lg"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                    <span>Mobile (WhatsApp) *</span>
                    <span className="text-[10px] text-orange-600 font-bold uppercase tracking-wider">(Mandatory)</span>
                  </Label>
                  <Input 
                    placeholder="10-digit mobile number"
                    value={signupData.mobileNumber}
                    onChange={(e) => setSignupData({ ...signupData, mobileNumber: e.target.value })}
                    className="text-sm rounded-lg"
                    required
                  />
                  <p className="text-[10px] text-slate-400">Required for account security, inquiries & direct coordination</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">Business Type *</Label>
                  <Select
                    value={signupData.businessType}
                    onValueChange={(val: any) => setSignupData({ ...signupData, businessType: val })}
                  >
                    <SelectTrigger className="text-sm rounded-lg">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Retail / D2C Brand">Retail / D2C Brand</SelectItem>
                      <SelectItem value="Tech Startup">Tech Startup</SelectItem>
                      <SelectItem value="Corporate / Enterprise">Corporate / Enterprise</SelectItem>
                      <SelectItem value="Exhibition Organizer">Exhibition Organizer</SelectItem>
                      <SelectItem value="F&B Brand">F&B Brand</SelectItem>
                      <SelectItem value="Artisan / Pop-up Vendor">Artisan / Pop-up Vendor</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">Headquarters / City *</Label>
                  <Input 
                    placeholder="e.g. Hyderabad"
                    value={signupData.city}
                    onChange={(e) => setSignupData({ ...signupData, city: e.target.value })}
                    className="text-sm rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700">Website or Instagram Link (Optional)</Label>
                <Input 
                  placeholder="https://brand.com"
                  value={signupData.websiteUrl}
                  onChange={(e) => setSignupData({ ...signupData, websiteUrl: e.target.value })}
                  className="text-sm rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">Password *</Label>
                  <Input 
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min 6 characters"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    className="text-sm rounded-lg"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-700">Confirm Password *</Label>
                  <Input 
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirm password"
                    value={signupData.confirmPassword}
                    onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                    className="text-sm rounded-lg"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 rounded-lg mt-2 shadow-sm"
              >
                {loading ? 'Registering Brand...' : 'Complete Business Registration'}
              </Button>
            </form>

            <div className="mt-6 text-center text-xs text-slate-500">
              Already registered as a business?{' '}
              <Link to="/business/login" className="text-orange-600 hover:underline font-semibold">
                Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusinessSignup;
