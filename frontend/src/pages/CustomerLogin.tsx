import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCustomerAuth } from '@/contexts/CustomerAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff } from 'lucide-react';

const CustomerLogin: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signIn, sendCustomerResetCode, resetCustomerPasswordWithCode } = useCustomerAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Forgot password state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1); // 1 = Email, 2 = Code
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState('');
  const [resetError, setResetError] = useState('');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const { customer, error } = await signIn(
        formData.email.trim(),
        formData.password
      );

      if (error) {
        if (
          error.message?.includes('Invalid credentials') || 
          error.message?.includes('No rows') || 
          error.message?.includes('JSON object requested') ||
          error.message?.includes('Cannot coerce')
        ) {
          setErrors({ general: 'Invalid email or password' });
        } else {
          setErrors({ general: error.message || 'An error occurred during login' });
        }
      } else if (customer) {
        // Redirect to the page specified in redirect parameter, or home page
        const redirectPath = searchParams.get('redirect') || '/';
        navigate(redirectPath);
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const handleSendResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetEmail.trim()) {
      setResetError('Email address is required');
      return;
    }

    setResetLoading(true);
    setResetError('');
    setResetMessage('');

    try {
      const result = await sendCustomerResetCode(resetEmail.trim());
      if (result.success) {
        setResetMessage(result.message);
        setForgotPasswordStep(2);
      } else {
        setResetError(result.message || 'Failed to send verification code');
      }
    } catch (error) {
      console.error('Customer send reset code error:', error);
      setResetError('An error occurred while sending code. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  const handleResetPasswordWithCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resetCode.trim() || !newPassword || !confirmPassword) {
      setResetError('All fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setResetError('Passwords do not match');
      return;
    }

    setResetLoading(true);
    setResetError('');
    setResetMessage('');

    try {
      const result = await resetCustomerPasswordWithCode(resetEmail.trim(), resetCode.trim(), newPassword);
      if (result.success) {
        setResetMessage(result.message);
        setTimeout(() => {
          setShowForgotPassword(false);
          setForgotPasswordStep(1);
          setResetEmail('');
          setResetCode('');
          setNewPassword('');
          setConfirmPassword('');
          setResetMessage('');
        }, 3000);
      } else {
        setResetError(result.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Customer reset password with code error:', error);
      setResetError('An error occurred during password reset. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {showForgotPassword ? 'Reset Password' : 'Customer Login'}
          </CardTitle>
          <CardDescription className="text-center">
            {showForgotPassword 
              ? (forgotPasswordStep === 1 
                  ? 'Enter your email address to receive a verification code' 
                  : 'Enter the verification code and set your new password')
              : 'Sign in to access your saved search preferences and personalized recommendations'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showForgotPassword ? (
            forgotPasswordStep === 1 ? (
              <form onSubmit={handleSendResetCode} className="space-y-4">
                {resetError && (
                  <Alert variant="destructive">
                    <AlertDescription>{resetError}</AlertDescription>
                  </Alert>
                )}
                {resetMessage && (
                  <div className="flex items-center gap-2 p-3 text-green-700 bg-green-50 border border-green-200 rounded-lg text-sm">
                    <AlertDescription>{resetMessage}</AlertDescription>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email Address</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    disabled={resetLoading}
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={resetLoading}>
                  {resetLoading ? 'Sending Code...' : 'Send Verification Code'}
                </Button>

                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotPasswordStep(1);
                    setResetError('');
                    setResetMessage('');
                  }}
                  className="w-full text-center text-sm text-blue-600 hover:underline mt-2"
                  disabled={resetLoading}
                >
                  Back to Login
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPasswordWithCode} className="space-y-4">
                {resetError && (
                  <Alert variant="destructive">
                    <AlertDescription>{resetError}</AlertDescription>
                  </Alert>
                )}
                {resetMessage && (
                  <div className="flex items-center gap-2 p-3 text-green-700 bg-green-50 border border-green-200 rounded-lg text-sm">
                    <AlertDescription>{resetMessage}</AlertDescription>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="reset-email-display">Email Address</Label>
                  <Input
                    id="reset-email-display"
                    type="email"
                    value={resetEmail}
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="verification-code">Verification Access Code</Label>
                  <Input
                    id="verification-code"
                    type="text"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    placeholder="Enter 6-digit access code"
                    disabled={resetLoading}
                    maxLength={6}
                    required
                    className="text-center font-mono text-lg tracking-widest"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    disabled={resetLoading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    disabled={resetLoading}
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={resetLoading}>
                  {resetLoading ? 'Resetting Password...' : 'Reset Password'}
                </Button>

                <button
                  type="button"
                  onClick={() => {
                    setForgotPasswordStep(1);
                    setResetError('');
                    setResetMessage('');
                    setResetCode('');
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                  className="w-full text-center text-sm text-blue-600 hover:underline mt-2"
                  disabled={resetLoading}
                >
                  Back to Email Input
                </button>
              </form>
            )
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.general && (
                <Alert variant="destructive">
                  <AlertDescription>
                    <div>{errors.general}</div>
                    {(errors.general.includes('Invalid') || errors.general.includes('password')) && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowForgotPassword(true);
                          setErrors({});
                        }}
                        className="text-xs font-semibold underline mt-2 block text-left"
                      >
                        Forgot password? Reset it here
                      </button>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email address"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Password</Label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(true);
                      setErrors({});
                    }}
                    className="text-xs text-blue-600 hover:underline"
                    disabled={loading}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Enter your password"
                    className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/customer-signup')}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Create one here
              </button>
            </p>
          </div>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ← Back to Home
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerLogin;
