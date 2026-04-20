import React, { useState, useEffect } from 'react';
import { Heart, Lock, User, ArrowRight, X, Loader2 } from 'lucide-react';
import { useCustomerAuth } from '@/contexts/CustomerAuthContext';
import { saveLikeVendor, removeLikeVendor, checkVendorLiked } from '@/services/likedVendorsApiService';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { useNavigate } from 'react-router-dom';

interface LikeButtonProps {
  vendorId: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  onLikeChange?: (isLiked: boolean) => void;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  vendorId,
  size = 'md',
  showText = false,
  className = '',
  onLikeChange
}) => {
  const { customer, signIn } = useCustomerAuth();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkIfLiked = async () => {
    if (!customer || !vendorId || isChecking) return;
    
    setIsChecking(true);
    try {
      const vendorIdStr = String(vendorId).trim();
      const result = await checkVendorLiked(customer.id, vendorIdStr);
      if (result.success) {
        const liked = result.is_liked === true || !!result.data;
        setIsLiked(liked);
      }
    } catch (error) {
      console.error('Error checking like status:', error);
    } finally {
      setInitialized(true);
      setIsChecking(false);
    }
  };

  useEffect(() => {
    if (customer && vendorId) {
      checkIfLiked();
    } else {
      setInitialized(true);
      setIsLiked(false);
    }
  }, [customer?.id, vendorId]);

  useEffect(() => {
    const handleEvent = (e: CustomEvent) => {
      if (String(e.detail.vendorId).trim() === String(vendorId).trim()) {
        setIsLiked(e.type === 'vendorLiked' || (e.type === 'vendorLikeStatusChanged' && e.detail.isLiked));
        setInitialized(true);
      }
    };

    window.addEventListener('vendorLiked', handleEvent as EventListener);
    window.addEventListener('vendorUnliked', handleEvent as EventListener);
    window.addEventListener('vendorLikeStatusChanged', handleEvent as EventListener);
    return () => {
      window.removeEventListener('vendorLiked', handleEvent as EventListener);
      window.removeEventListener('vendorUnliked', handleEvent as EventListener);
      window.removeEventListener('vendorLikeStatusChanged', handleEvent as EventListener);
    };
  }, [vendorId]);

  const handleSimpleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!customer) {
      setShowLoginModal(true);
      return;
    }
    if (loading || isChecking) return;

    setLoading(true);
    try {
      const vendorIdStr = String(vendorId).trim();
      const newStatus = !isLiked;
      const result = newStatus 
        ? await saveLikeVendor(customer.id, vendorIdStr)
        : await removeLikeVendor(customer.id, vendorIdStr);

      if (result.success) {
        setIsLiked(newStatus);
        onLikeChange?.(newStatus);
        window.dispatchEvent(new CustomEvent(newStatus ? 'vendorLiked' : 'vendorUnliked', { 
          detail: { vendorId: vendorIdStr } 
        }));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);
    try {
      const { customer: loggedInCustomer, error } = await signIn(loginData.email.trim(), loginData.password);
      if (error) {
        setLoginError(error.message || 'Login failed');
      } else if (loggedInCustomer) {
        setShowLoginModal(false);
        // Automatically like after login
        const vendorIdStr = String(vendorId).trim();
        await saveLikeVendor(loggedInCustomer.id, vendorIdStr);
        setIsLiked(true);
        onLikeChange?.(true);
        window.dispatchEvent(new CustomEvent('vendorLiked', { detail: { vendorId: vendorIdStr } }));
      }
    } catch (err) {
      setLoginError('An unexpected error occurred');
    } finally {
      setLoginLoading(false);
    }
  };

  const iconSize = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5';
  const textSize = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm';

  return (
    <>
      <button
        onClick={handleSimpleClick}
        disabled={loading || isChecking}
        className={`flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 ${
          isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
        } ${className}`}
        title={isLiked ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Heart 
          className={`${iconSize} transition-all duration-200 ${
            isLiked ? 'fill-red-500 text-red-500 stroke-red-500' : 'text-gray-400 fill-none stroke-gray-400'
          }`}
          style={{ strokeWidth: 2 }}
        />
        {showText && <span className={`${textSize} font-medium ml-1`}>{isLiked ? 'Liked' : 'Like'}</span>}
      </button>

      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold flex items-center justify-center gap-2">
              <Lock className="h-6 w-6 text-orange-500" />
              Login to Like Vendor
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && <Alert variant="destructive"><AlertDescription>{loginError}</AlertDescription></Alert>}
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="login-password">Password</Label>
              <Input
                id="login-password"
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-3 pt-2">
              <Button type="submit" disabled={loginLoading} className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                {loginLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Login & Like Vendor'}
              </Button>
              <Button variant="outline" onClick={() => navigate('/customer-signup')} className="w-full">Create New Account</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LikeButton;
