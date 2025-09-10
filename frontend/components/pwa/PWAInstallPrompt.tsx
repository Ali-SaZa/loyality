"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@heroui/button';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal';
import { Chip } from '@heroui/chip';
import { usePWA } from '@/hooks/usePWA';

interface PWAInstallPromptProps {
  className?: string;
}

export default function PWAInstallPrompt({ className }: PWAInstallPromptProps) {
  const { install, serviceWorker, offline } = usePWA();
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Show install prompt if app is installable and not already installed
    if (install.isInstallable && !install.isInstalled && !install.isStandalone) {
      // Delay showing the prompt to avoid being too aggressive
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [install.isInstallable, install.isInstalled, install.isStandalone]);

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      const success = await install.installApp();
      if (success) {
        setShowPrompt(false);
        // Show success message
        console.log('App installed successfully!');
      }
    } catch (error) {
      console.error('Installation failed:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Store dismissal to avoid showing again immediately
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // Don't show if already dismissed recently (within 24 hours)
  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      const now = Date.now();
      const hoursSinceDismissed = (now - dismissedTime) / (1000 * 60 * 60);
      
      if (hoursSinceDismissed < 24) {
        setShowPrompt(false);
      }
    }
  }, []);

  if (!showPrompt || !install.isInstallable) {
    return null;
  }

  return (
    <Modal 
      isOpen={showPrompt} 
      onClose={handleDismiss}
      size="md"
      placement="center"
      backdrop="blur"
      className={className}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-2xl">📱</span>
            </div>
          </div>
          <h3 className="text-xl font-bold">نصب برنامه وفاداری</h3>
        </ModalHeader>
        
        <ModalBody className="text-center">
          <p className="text-gray-600 mb-4">
            برنامه وفاداری را روی دستگاه خود نصب کنید تا تجربه بهتری داشته باشید
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              <Chip size="sm" color="success" variant="flat">
                دسترسی آسان
              </Chip>
              <Chip size="sm" color="primary" variant="flat">
                کار آفلاین
              </Chip>
              <Chip size="sm" color="warning" variant="flat">
                اعلان‌ها
              </Chip>
            </div>
            
            <div className="text-sm text-gray-500">
              <p>✅ دسترسی سریع از صفحه اصلی</p>
              <p>✅ کارکرد بدون اینترنت</p>
              <p>✅ دریافت اعلان‌های مهم</p>
            </div>
          </div>
        </ModalBody>
        
        <ModalFooter className="flex flex-col gap-2">
          <Button
            color="primary"
            size="lg"
            className="w-full"
            onPress={handleInstall}
            isLoading={isInstalling}
            isDisabled={isInstalling}
          >
            {isInstalling ? "در حال نصب..." : "نصب برنامه"}
          </Button>
          
          <Button
            variant="light"
            size="sm"
            onPress={handleDismiss}
            className="w-full"
          >
            شاید بعداً
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

// PWA Status Component
export function PWAStatus() {
  const { install, serviceWorker, offline, notifications } = usePWA();
  const [showStatus, setShowStatus] = useState(false);

  if (!showStatus) {
    return (
      <Button
        size="sm"
        variant="light"
        onPress={() => setShowStatus(true)}
        className="fixed bottom-4 left-4 z-50"
      >
        📱 PWA
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 left-4 z-50 w-80">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-semibold">وضعیت PWA</h4>
          <Button
            size="sm"
            variant="light"
            onPress={() => setShowStatus(false)}
          >
            ✕
          </Button>
        </div>
      </CardHeader>
      
      <CardBody className="pt-0">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>نصب شده:</span>
            <Chip size="sm" color={install.isInstalled ? "success" : "default"}>
              {install.isInstalled ? "بله" : "خیر"}
            </Chip>
          </div>
          
          <div className="flex justify-between">
            <span>قابل نصب:</span>
            <Chip size="sm" color={install.isInstallable ? "primary" : "default"}>
              {install.isInstallable ? "بله" : "خیر"}
            </Chip>
          </div>
          
          <div className="flex justify-between">
            <span>Service Worker:</span>
            <Chip size="sm" color={serviceWorker.isRegistered ? "success" : "default"}>
              {serviceWorker.isRegistered ? "فعال" : "غیرفعال"}
            </Chip>
          </div>
          
          <div className="flex justify-between">
            <span>وضعیت آنلاین:</span>
            <Chip size="sm" color={offline.isOnline ? "success" : "danger"}>
              {offline.isOnline ? "آنلاین" : "آفلاین"}
            </Chip>
          </div>
          
          <div className="flex justify-between">
            <span>اعلان‌ها:</span>
            <Chip size="sm" color={notifications.isSubscribed ? "success" : "default"}>
              {notifications.isSubscribed ? "فعال" : "غیرفعال"}
            </Chip>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

// Offline Indicator Component
export function OfflineIndicator() {
  const { offline } = usePWA();
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    if (offline.isOffline) {
      setShowIndicator(true);
    } else {
      // Hide after 3 seconds when back online
      const timer = setTimeout(() => {
        setShowIndicator(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [offline.isOffline]);

  if (!showIndicator) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <Chip
        color={offline.isOffline ? "danger" : "success"}
        variant="flat"
        className="animate-pulse"
      >
        {offline.isOffline ? "🔴 آفلاین" : "🟢 آنلاین"}
      </Chip>
    </div>
  );
}
