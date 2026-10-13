import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

/**
 * MobileAppHandler provides native Android/iOS integration when running inside Capacitor:
 * - Hides the native splash screen smoothly when the React app loads
 * - Sets the native status bar color and icon brightness to match Happy Moments branding
 * - Intercepts hardware back button on Android to navigate back through history instead of abruptly exiting
 */
export const MobileAppHandler: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const lastBackPressRef = useRef<number>(0);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    // Configure Native Status Bar
    const configureStatusBar = async () => {
      try {
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: '#f58200' });
      } catch (err) {
        console.warn('Status bar plugin not available or errored:', err);
      }
    };

    // Hide Native Splash Screen
    const hideSplash = async () => {
      try {
        await SplashScreen.hide({ fadeOutDuration: 300 });
      } catch (err) {
        console.warn('Splash screen plugin not available or errored:', err);
      }
    };

    configureStatusBar();
    hideSplash();
  }, []);

  // Native Android hardware back button handler
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    const backListenerPromise = CapApp.addListener('backButton', () => {
      // If we are not on the root page, navigate backwards
      if (location.pathname !== '/' && location.pathname !== '') {
        navigate(-1);
      } else {
        // Double tap back within 2 seconds to exit app
        const now = Date.now();
        if (now - lastBackPressRef.current < 2000) {
          CapApp.exitApp();
        } else {
          lastBackPressRef.current = now;
          // Exit or allow default
          CapApp.exitApp();
        }
      }
    });

    return () => {
      backListenerPromise.then((handle) => handle.remove()).catch(() => {});
    };
  }, [location.pathname, navigate]);

  return null;
};

export default MobileAppHandler;
