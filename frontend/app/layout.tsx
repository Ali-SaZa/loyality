import "@/styles/tailwind.css";
import "@/styles/globals.scss";
import { Toaster } from "react-hot-toast";
import React from "react";

import { Providers } from "./providers";

import { danaFont } from "@/config/fonts";
import Loading from "@/components/layouts/Loading";
import PWAInstallPrompt, { OfflineIndicator } from "@/components/pwa/PWAInstallPrompt";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      suppressHydrationWarning
      className="!overflow-auto"
      dir="rtl"
      lang="fa-IR"
    >
      <head>
        <title>مانا - باشگاه وفاداری مشتریان</title>

        {/* Google Analytics - Now handled by GoogleAnalytics component */}

        {/*توضیحات کوتاه (SEO Meta Description)*/}
        <meta content="مانا - باشگاه وفاداری مشتریان - سیستم مدیریت وفاداری مشتریان" name="description" />

        {/*کلمات کلیدی (اکنون کاربرد کمتری دارد)*/}
        <meta content="مانا, باشگاه وفاداری, مشتریان, وفاداری, پاداش, gardou" name="keywords" />

        {/*نویسنده محتوا*/}
        <meta content="نیتک" name="author" />

        {/*مشخص کردن زبان*/}
        <meta content="fa" httpEquiv="Content-Language" />

        {/*viewport برای نمایش در دستگاه‌های موبایل*/}
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        
        {/* Additional zoom prevention */}
        <meta content="no" name="format-detection" />
        
        {/* iOS Keyboard handling */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Handle iOS keyboard for modals
              document.addEventListener('DOMContentLoaded', function() {
                const inputs = document.querySelectorAll('input, textarea');
                inputs.forEach(function(input) {
                  input.addEventListener('focus', function() {
                    // Small delay to ensure keyboard is open
                    setTimeout(function() {
                      input.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center',
                        inline: 'nearest'
                      });
                    }, 300);
                  });
                });
              });
            `,
          }}
        />
        

        {/*عنوان برای شبکه‌های اجتماعی*/}
        <meta content="مانا - باشگاه وفاداری مشتریان" property="og:title" />

        {/*توضیحات کوتاه برای اشتراک‌گذاری*/}
        <meta content="مانا - باشگاه وفاداری مشتریان - سیستم مدیریت وفاداری مشتریان" property="og:description" />

        {/*تصویر پیش‌نمایش*/}
        {/* <meta
          content="https://obs.ir/images/OBS.webp"
          property="og:image"
        /> */}

        {/*آدرس صفحه*/}
        {/* <meta
          content="https://obs.ir"
          property="og:url"
        /> */}

        {/*نوع محتوا*/}
        <meta content="website" property="og:type" />

        {/*نام سایت*/}
        <meta content="مانا - باشگاه وفاداری مشتریان" property="og:site_name" />

        {/*زبان صفحه*/}
        <meta content="fa_IR" property="og:locale" />

        {/*URL اصلی صفحه*/}
        <link href="https://www.gardou.ir" rel="canonical" />

        {/*جلوگیری از Sniff کردن MIME Types*/}
        <meta content="IE=edge" httpEquiv="X-UA-Compatible" />

        {/*جلوگیری از Index شدن نسخه‌های تکراری*/}
        <meta content="noarchive" name="robots" />

        {/*مدت زمان کش صفحه*/}
        <meta content="max-age=31536000" httpEquiv="cache-control" />

        {/* PWA Meta Tags */}
        <meta name="application-name" content="مانا" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="مانا" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#0066cc" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#0066cc" />

        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/icons/apple-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/apple-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-icon-180x180.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/apple-icon-180x180.png" />

        {/* Favicons */}
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <link rel="shortcut icon" href="/icons/favicon.ico" />

        {/* Web App Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Splash Screens for iOS */}
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-startup-image" href="/icons/apple-splash-2048-2732.svg" media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/icons/apple-splash-1668-2224.svg" media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/icons/apple-splash-1536-2048.svg" media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/icons/apple-splash-1125-2436.svg" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/icons/apple-splash-1242-2208.svg" media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/icons/apple-splash-750-1334.svg" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/icons/apple-splash-640-1136.svg" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
      </head>
      <body
        className={`min-h-[100dvh] bg-background font-sans antialiased overflow-hidden ${danaFont.variable}`}
      >
        <Providers
          themeProps={{
            attribute: "class",
            defaultTheme: "light",
            forcedTheme: "light",
          }}
        >
          <div className="min-h-[100dvh] ">{children}</div>
          <Toaster position="bottom-center" />
          <Loading />
          
          {/* PWA Components */}
          <PWAInstallPrompt />
          <OfflineIndicator />
          
          {/* Google Analytics */}
          <GoogleAnalytics />
        </Providers>
      </body>
    </html>
  );
}
