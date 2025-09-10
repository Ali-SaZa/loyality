// PWA Utilities and Hooks
// High-quality implementation for Loyalty Program PWA

import { useState, useEffect, useCallback } from 'react';

// PWA Installation State
export interface PWAInstallState {
  isInstallable: boolean;
  isInstalled: boolean;
  isStandalone: boolean;
  deferredPrompt: BeforeInstallPromptEvent | null;
}

// Before Install Prompt Event Type
export interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// PWA Hook for managing installation
export function usePWAInstall() {
  const [installState, setInstallState] = useState<PWAInstallState>({
    isInstallable: false,
    isInstalled: false,
    isStandalone: false,
    deferredPrompt: null,
  });

  useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInstalled = (window.navigator as any).standalone || isStandalone;

    setInstallState(prev => ({
      ...prev,
      isInstalled,
      isStandalone,
    }));

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallState(prev => ({
        ...prev,
        isInstallable: true,
        deferredPrompt: e as BeforeInstallPromptEvent,
      }));
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setInstallState(prev => ({
        ...prev,
        isInstalled: true,
        isInstallable: false,
        deferredPrompt: null,
      }));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installApp = useCallback(async () => {
    if (!installState.deferredPrompt) {
      return false;
    }

    try {
      await installState.deferredPrompt.prompt();
      const choiceResult = await installState.deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        setInstallState(prev => ({
          ...prev,
          isInstallable: false,
          deferredPrompt: null,
        }));
        return true;
      }
    } catch (error) {
      console.error('PWA installation failed:', error);
    }
    
    return false;
  }, [installState.deferredPrompt]);

  return {
    ...installState,
    installApp,
  };
}

// Service Worker Management Hook
export function useServiceWorker() {
  const [swState, setSwState] = useState({
    isSupported: false,
    isRegistered: false,
    isUpdated: false,
    registration: null as ServiceWorkerRegistration | null,
  });

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      setSwState(prev => ({ ...prev, isSupported: true }));
      
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          setSwState(prev => ({
            ...prev,
            isRegistered: true,
            registration,
          }));

          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setSwState(prev => ({ ...prev, isUpdated: true }));
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, []);

  const updateServiceWorker = useCallback(() => {
    if (swState.registration && swState.registration.waiting) {
      swState.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  }, [swState.registration]);

  return {
    ...swState,
    updateServiceWorker,
  };
}

// Push Notification Hook
export function usePushNotifications() {
  const [notificationState, setNotificationState] = useState({
    isSupported: false,
    permission: 'default' as NotificationPermission,
    isSubscribed: false,
    subscription: null as PushSubscription | null,
  });

  useEffect(() => {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      setNotificationState(prev => ({
        ...prev,
        isSupported: true,
        permission: Notification.permission,
      }));

      // Check existing subscription
      navigator.serviceWorker.ready.then((registration) => {
        registration.pushManager.getSubscription().then((subscription) => {
          setNotificationState(prev => ({
            ...prev,
            isSubscribed: !!subscription,
            subscription,
          }));
        });
      });
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!notificationState.isSupported) {
      return false;
    }

    const permission = await Notification.requestPermission();
    setNotificationState(prev => ({ ...prev, permission }));
    return permission === 'granted';
  }, [notificationState.isSupported]);

  const subscribeToPush = useCallback(async () => {
    if (!notificationState.isSupported || notificationState.permission !== 'granted') {
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      });

      setNotificationState(prev => ({
        ...prev,
        isSubscribed: true,
        subscription,
      }));

      // Send subscription to server
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      });

      return true;
    } catch (error) {
      console.error('Push subscription failed:', error);
      return false;
    }
  }, [notificationState.isSupported, notificationState.permission]);

  const unsubscribeFromPush = useCallback(async () => {
    if (!notificationState.subscription) {
      return false;
    }

    try {
      await notificationState.subscription.unsubscribe();
      setNotificationState(prev => ({
        ...prev,
        isSubscribed: false,
        subscription: null,
      }));

      // Notify server
      await fetch('/api/push/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ endpoint: notificationState.subscription.endpoint }),
      });

      return true;
    } catch (error) {
      console.error('Push unsubscription failed:', error);
      return false;
    }
  }, [notificationState.subscription]);

  return {
    ...notificationState,
    requestPermission,
    subscribeToPush,
    unsubscribeFromPush,
  };
}

// Offline Detection Hook
export function useOfflineDetection() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Set initial state
    setIsOnline(navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, isOffline: !isOnline };
}

// PWA Update Hook
export function usePWAUpdate() {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setIsUpdateAvailable(true);
      });
    }
  }, []);

  const updateApp = useCallback(async () => {
    if (!isUpdateAvailable) return;

    setIsUpdating(true);
    try {
      // Reload the page to get the new service worker
      window.location.reload();
    } catch (error) {
      console.error('App update failed:', error);
      setIsUpdating(false);
    }
  }, [isUpdateAvailable]);

  return {
    isUpdateAvailable,
    isUpdating,
    updateApp,
  };
}

// Combined PWA Hook
export function usePWA() {
  const installState = usePWAInstall();
  const swState = useServiceWorker();
  const notificationState = usePushNotifications();
  const offlineState = useOfflineDetection();
  const updateState = usePWAUpdate();

  return {
    install: installState,
    serviceWorker: swState,
    notifications: notificationState,
    offline: offlineState,
    update: updateState,
  };
}

// Utility functions
export const PWAUtils = {
  // Check if running as PWA
  isPWA: () => {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone ||
           document.referrer.includes('android-app://');
  },

  // Get PWA display mode
  getDisplayMode: () => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return 'standalone';
    }
    if (window.matchMedia('(display-mode: minimal-ui)').matches) {
      return 'minimal-ui';
    }
    if (window.matchMedia('(display-mode: fullscreen)').matches) {
      return 'fullscreen';
    }
    return 'browser';
  },

  // Check if device supports PWA features
  getPWACapabilities: () => {
    return {
      serviceWorker: 'serviceWorker' in navigator,
      pushNotifications: 'Notification' in window && 'serviceWorker' in navigator,
      backgroundSync: 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype,
      webShare: 'share' in navigator,
      webShareTarget: 'serviceWorker' in navigator && 'shareTarget' in window.ServiceWorkerRegistration.prototype,
      installPrompt: 'BeforeInstallPromptEvent' in window,
    };
  },

  // Show install prompt
  showInstallPrompt: async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
    }
  },
};

export default usePWA;
