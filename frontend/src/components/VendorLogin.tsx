import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { User, Lock, LogIn, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { vendorLogin, saveVendorSession, sendVendorResetCode, resetVendorPasswordWithCode } from '../services/supabaseService';

interface VendorLoginProps {
  onClose?: () => void;
}

const VendorLogin: React.FC<VendorLoginProps> = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Forgot Password state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1); // 1 = Email, 2 = Code
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState('');
  const [resetError, setResetError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await vendorLogin(username.trim(), password);
      
      if (result.success && result.vendor) {
        // Save vendor session
        saveVendorSession(result.vendor);
        
        // Navigate to vendor dashboard
        navigate('/vendor-dashboard');
        
        // Close modal if it's a modal
        if (onClose) {
          onClose();
        }
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      setResetError('Please enter your registered email address');
      return;
    }
    setResetLoading(true);
    setResetError('');
    setResetMessage('');
    try {
      const result = await sendVendorResetCode(resetEmail.trim());
      if (result.success) {
        setResetMessage(result.message);
        setForgotPasswordStep(2);
      } else {
        setResetError(result.message || 'Failed to send verification code');
      }
    } catch (error) {
      console.error('Reset password send code error:', error);
      setResetError('An error occurred while sending the code. Please try again.');
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
      const result = await resetVendorPasswordWithCode(resetEmail.trim(), resetCode.trim(), newPassword);
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
      console.error('Reset password with code error:', error);
      setResetError('An error occurred during password reset. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
          <LogIn className="w-6 h-6 text-blue-600" />
          {showForgotPassword ? 'Reset Password' : 'Vendor Login'}
        </CardTitle>
        <p className="text-gray-600">
          {showForgotPassword ? 'Request a new temporary password' : 'Access your vendor dashboard'}
        </p>
      </CardHeader>
      
      <CardContent>
        {showForgotPassword ? (
          forgotPasswordStep === 1 ? (
            <form onSubmit={handleSendResetCode} className="space-y-4">
              {resetError && (
                <div className="flex items-center gap-2 p-3 text-red-700 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{resetError}</span>
                </div>
              )}
              
              {resetMessage && (
                <div className="flex items-center gap-2 p-3 text-green-700 bg-green-50 border border-green-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-green-600" />
                  <span className="text-sm">{resetMessage}</span>
                </div>
              )}
              
              <div className="space-y-2">
                <label htmlFor="resetEmail" className="text-sm font-medium text-gray-700">
                  Registered Email Address
                </label>
                <Input
                  id="resetEmail"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  disabled={resetLoading}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={resetLoading}
              >
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
                <div className="flex items-center gap-2 p-3 text-red-700 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{resetError}</span>
                </div>
              )}
              
              {resetMessage && (
                <div className="flex items-center gap-2 p-3 text-green-700 bg-green-50 border border-green-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-green-600" />
                  <span className="text-sm">{resetMessage}</span>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="resetEmailDisplay" className="text-sm font-medium text-gray-700">
                  Registered Email Address
                </label>
                <Input
                  id="resetEmailDisplay"
                  type="email"
                  value={resetEmail}
                  disabled
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="resetCode" className="text-sm font-medium text-gray-700">
                  Verification Code
                </label>
                <Input
                  id="resetCode"
                  type="text"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  placeholder="Enter 6-digit access code"
                  disabled={resetLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                  New Password
                </label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  disabled={resetLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  disabled={resetLoading}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={resetLoading}
              >
                {resetLoading ? 'Resetting Password...' : 'Reset Password'}
              </Button>

              <button
                type="button"
                onClick={() => {
                  setForgotPasswordStep(1);
                  setResetError('');
                  setResetMessage('');
                }}
                className="w-full text-center text-sm text-blue-600 hover:underline mt-2"
                disabled={resetLoading}
              >
                Back to Email Step
              </button>
            </form>
          )
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 text-red-700 bg-red-50 border border-red-200 rounded-lg space-y-1">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
                {(error.includes('Invalid') || error.includes('password')) && (
                  <div className="pl-6">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPassword(true);
                        setError('');
                      }}
                      className="text-xs font-semibold underline text-blue-600 hover:text-blue-800 block text-left"
                    >
                      Forgot password? Reset it here
                    </button>
                  </div>
                )}
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="pl-10"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(true);
                    setError('');
                  }}
                  className="text-xs text-blue-600 hover:underline"
                  disabled={loading}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pl-10 pr-10"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Logging in...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Login
                </div>
              )}
            </Button>
          </form>
        )}

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800 font-medium mb-2">Available Vendor Credentials:</p>
          <div className="text-xs text-blue-700 space-y-1">
            <div><strong>Test 6:</strong> Username: 59, Password: quPkJu</div>
            <div><strong>Test 5:</strong> Username: 58, Password: eMoWz1</div>
            <div><strong>Hima Bindu Events:</strong> Username: 48, Password: PmruCM</div>
            <div><strong>Photographer Priya:</strong> Username: 54, Password: X7REp0</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VendorLogin;
