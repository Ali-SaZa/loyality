import type { Metadata, Viewport } from "next";
import "./globals.css";
import RootLayout from "@/components/layout/RootLayout";

export const metadata: Metadata = {
  title: "Loyalty Program",
  description: "Modern loyalty system for traditional businesses in Iran",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Loyalty Program",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#006d77',
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <RootLayout>
          {children}
        </RootLayout>
      </body>
    </html>
  );
}
