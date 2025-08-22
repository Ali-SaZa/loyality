'use client';

import { HeroUIProvider } from '@heroui/react';
import { herouiTheme } from '@/lib/theme';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <HeroUIProvider theme={herouiTheme}>
      <div 
        className="min-h-screen bg-background"
        style={{
          '--caribbean-current': '#006d77',
          '--tiffany-blue': '#83c5be',
          '--alice-blue': '#edf6f9',
          '--anti-flash-white': '#e9ecef',
          '--onyx': '#343a40',
        } as React.CSSProperties}
      >
        {children}
      </div>
    </HeroUIProvider>
  );
}
