'use client';

import { HeroUIProvider } from '@heroui/react';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <HeroUIProvider>
      <div className="min-h-screen bg-background">
        {children}
      </div>
    </HeroUIProvider>
  );
}
