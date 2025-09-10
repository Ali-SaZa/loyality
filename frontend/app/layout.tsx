import "@/styles/tailwind.css";
import { Toaster } from "react-hot-toast";
import React from "react";

import { Providers } from "./providers";

import { danaFont } from "@/config/fonts";
import Loading from "@/components/layouts/Loading";

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
        <title>Customer Loyalty</title>

        {/* Google tag (gtag.js) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-2B7YC68RS6"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-2B7YC68RS6');
          `,
          }}
        />

        {/*توضیحات کوتاه (SEO Meta Description)*/}
        <meta content="شبیه ساز آنلاین کسب و کار" name="description" />

        {/*کلمات کلیدی (اکنون کاربرد کمتری دارد)*/}
        <meta content="obs ,شبیه ساز, کسب و کار, آنلاین" name="keywords" />

        {/*نویسنده محتوا*/}
        <meta content="نیتک" name="author" />

        {/*مشخص کردن زبان*/}
        <meta content="fa" httpEquiv="Content-Language" />

        {/*viewport برای نمایش در دستگاه‌های موبایل*/}
        <meta content="width=device-width, initial-scale=1" name="viewport" />

        {/*عنوان برای شبکه‌های اجتماعی*/}
        <meta content="Customer Loyalty" property="og:title" />

        {/*توضیحات کوتاه برای اشتراک‌گذاری*/}
        <meta content="باشگاه مشتریان" property="og:description" />

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
        <meta content="Customer Loyalty" property="og:site_name" />

        {/*زبان صفحه*/}
        <meta content="fa_IR" property="og:locale" />

        {/*URL اصلی صفحه*/}
        <link href="https://customer-loyalty.ir" rel="canonical" />

        {/*جلوگیری از Sniff کردن MIME Types*/}
        <meta content="IE=edge" httpEquiv="X-UA-Compatible" />

        {/*جلوگیری از Index شدن نسخه‌های تکراری*/}
        <meta content="noarchive" name="robots" />

        {/*مدت زمان کش صفحه*/}
        <meta content="max-age=31536000" httpEquiv="cache-control" />
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
        </Providers>
      </body>
    </html>
  );
}
