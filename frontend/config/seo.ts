// SEO Configuration for مانا Loyalty Program
export const SEO_CONFIG = {
  // Site Information
  siteName: 'مانا - باشگاه وفاداری مشتریان',
  siteUrl: 'https://www.gardou.ir',
  siteDescription: 'سیستم مدیریت وفاداری مشتریان برای فروشگاه‌ها و کسب و کارهای ایرانی',
  
  // Default Meta Tags
  defaultTitle: 'مانا - باشگاه وفاداری مشتریان',
  defaultDescription: 'سیستم مدیریت وفاداری مشتریان برای فروشگاه‌ها و کسب و کارهای ایرانی',
  defaultKeywords: 'مانا, باشگاه وفاداری, مشتریان, وفاداری, پاداش, سیستم مدیریت فروشگاه, کوپن تخفیف, برنامه وفاداری مشتریان',
  
  // Social Media
  twitterHandle: '@gardou_ir',
  facebookAppId: 'your-facebook-app-id',
  
  // Images
  defaultImage: '/images/og-image.jpg',
  logo: '/images/logo.png',
  
  // Contact Information
  contactEmail: 'info@gardou.ir',
  contactPhone: '+98-21-12345678',
  
  // Business Information
  businessName: 'مانا',
  businessType: 'Software Company',
  foundedYear: '2024',
  
  // Local SEO (Iran)
  country: 'Iran',
  region: 'Tehran',
  city: 'Tehran',
  postalCode: '1234567890',
  
  // Schema.org Types
  organizationType: 'SoftwareApplication',
  applicationCategory: 'BusinessApplication',
  
  // Analytics
  googleAnalyticsId: 'G-RJ2YEVJJRP',
  googleSearchConsoleId: 'your-search-console-id',
  
  // Additional SEO
  robots: 'index, follow',
  canonicalUrl: 'https://www.gardou.ir',
  alternateLanguages: [
    { hreflang: 'fa-IR', href: 'https://www.gardou.ir' },
    { hreflang: 'en-US', href: 'https://www.gardou.ir/en' }
  ]
};

// Page-specific SEO configurations (ONLY for public pages)
export const PAGE_SEO_CONFIG = {
  home: {
    title: 'مانا - باشگاه وفاداری مشتریان | سیستم مدیریت وفاداری',
    description: 'سیستم مدیریت وفاداری مشتریان برای فروشگاه‌ها و کسب و کارهای ایرانی. ایجاد کوپن تخفیف، مدیریت مشتریان و افزایش فروش.',
    keywords: 'برنامه وفاداری مشتریان, سیستم وفاداری, مدیریت فروشگاه, کوپن تخفیف, باشگاه مشتریان',
    canonical: 'https://www.gardou.ir'
  },
  
  auth: {
    title: 'ورود به مانا | باشگاه وفاداری مشتریان',
    description: 'ورود به سیستم مدیریت وفاداری مشتریان مانا. مدیریت فروشگاه، ایجاد کوپن تخفیف و تحلیل مشتریان.',
    keywords: 'ورود, لاگین, مانا, سیستم وفاداری, مدیریت فروشگاه',
    canonical: 'https://www.gardou.ir/auth'
  },
  
  promoRegistration: {
    title: 'ثبت نام در باشگاه وفاداری مانا',
    description: 'ثبت نام در برنامه وفاداری مشتریان مانا. دریافت کوپن تخفیف و امتیازات ویژه.',
    keywords: 'ثبت نام, باشگاه وفاداری, کوپن تخفیف, امتیازات',
    canonical: 'https://www.gardou.ir/auth/promo-registration'
  }
  
  // Note: Admin, Store, and Customer pages are PRIVATE and don't need SEO
  // They are behind authentication and not accessible to search engines
};

// Schema.org structured data
export const STRUCTURED_DATA = {
  organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "مانا",
    "alternateName": "Mana Loyalty Program",
    "url": "https://www.gardou.ir",
    "logo": "https://www.gardou.ir/images/logo.png",
    "description": "سیستم مدیریت وفاداری مشتریان برای فروشگاه‌ها و کسب و کارهای ایرانی",
    "foundingDate": "2024",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+98-21-12345678",
      "contactType": "customer service",
      "email": "info@gardou.ir"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IR",
      "addressRegion": "Tehran",
      "addressLocality": "Tehran"
    },
    "sameAs": [
      "https://www.instagram.com/gardou_ir",
      "https://t.me/gardou_ir"
    ]
  },
  
  softwareApplication: {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "مانا - باشگاه وفاداری مشتریان",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "description": "سیستم مدیریت وفاداری مشتریان برای فروشگاه‌ها و کسب و کارهای ایرانی",
    "url": "https://www.gardou.ir",
    "author": {
      "@type": "Organization",
      "name": "مانا"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "IRR",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "150"
    }
  },
  
  breadcrumbList: (items: Array<{name: string, url: string}>) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  })
};
