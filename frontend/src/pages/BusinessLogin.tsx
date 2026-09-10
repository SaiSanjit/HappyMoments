import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useBusinessAuth } from '@/contexts/BusinessAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Eye, EyeOff, LogIn, Sparkles, Building2 } from 'lucide-react';

const BusinessLogin: React.FC = () => {
  const navigate = useNavigate();
  const { signIn } = useBusinessAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDemoLogin = async () => {
    setLoading(true);
    setError('');
    const res = await signIn('business@spotlight.com', 'Business@123');
    setLoading(false);
    if (res.success) {
      navigate('/business-dashboard');
    } else {
      setError(res.error || 'Demo login failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please provide both business email and password');
      return;
    }
    setLoading(true);
    setError('');
    const res = await signIn(email.trim(), password);
    setLoading(false);
    if (res.success) {
      navigate('/business-dashboard');
    } else {
      setError(res.error || 'Invalid credentials');
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
          Sign In as Business Owner
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Access product launch venues, stalls, and custom quotations.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Card className="border-slate-200 shadow-md bg-white">
          <CardContent className="pt-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Business Email</Label>
                <Input 
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-lg text-sm"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Password</Label>
                <div className="relative">
                  <Input 
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-lg text-sm pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 rounded-lg shadow-sm"
              >
                {loading ? 'Signing In...' : 'Sign In to Dashboard'}
              </Button>

              <div className="pt-3 border-t border-slate-100">
                <Button 
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDemoLogin}
                  disabled={loading}
                  className="w-full text-xs font-semibold text-orange-600 border-orange-200 bg-orange-50 hover:bg-orange-100"
                >
                  ⚡ Instant Demo Login (Aura Innovations)
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center text-xs text-slate-500">
              Don't have a business account?{' '}
              <Link to="/business/signup" className="text-orange-600 hover:underline font-semibold">
                Register Brand
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusinessLogin;
