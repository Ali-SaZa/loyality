// Footer Schema Markup for مانا
export const FOOTER_SCHEMA_MARKUP = {
  // Organization Schema for Footer
  organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "مانا",
    "alternateName": "Mana Loyalty Program",
    "url": "https://www.gardou.ir",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.gardou.ir/images/logo.png",
      "width": 200,
      "height": 200
    },
    "description": "سیستم مدیریت وفاداری مشتریان برای فروشگاه‌ها و کسب و کارهای ایرانی",
    "foundingDate": "2024",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+98-21-12345678",
      "contactType": "customer service",
      "email": "info@gardou.ir",
      "availableLanguage": ["Persian", "English"],
      "areaServed": "IR",
      "hoursAvailable": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday"],
        "opens": "09:00",
        "closes": "18:00"
      }
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IR",
      "addressRegion": "Tehran",
      "addressLocality": "Tehran"
    },
    "sameAs": [
      "https://www.instagram.com/gardou_ir",
      "https://t.me/gardou_ir",
      "https://www.linkedin.com/company/gardou"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "خدمات برنامه وفاداری",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "سیستم مدیریت وفاداری مشتریان",
            "description": "راه‌اندازی و مدیریت برنامه وفاداری مشتریان"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "سیستم کوپن تخفیف",
            "description": "ایجاد و مدیریت کوپن‌های تخفیف"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "تحلیل داده‌های مشتریان",
            "description": "گزارش‌گیری و تحلیل رفتار مشتریان"
          }
        }
      ]
    }
  },

  // Site Navigation Schema
  siteNavigation: {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    "name": "منوی اصلی مانا",
    "url": "https://www.gardou.ir",
    "hasPart": [
      {
        "@type": "WebPage",
        "name": "خانه",
        "url": "https://www.gardou.ir"
      },
      {
        "@type": "WebPage",
        "name": "وبلاگ",
        "url": "https://www.gardou.ir/blog"
      },
      {
        "@type": "WebPage",
        "name": "درباره ما",
        "url": "https://www.gardou.ir/about"
      },
      {
        "@type": "WebPage",
        "name": "تماس با ما",
        "url": "https://www.gardou.ir/contact"
      }
    ]
  },

  // Blog Schema for Footer
  blog: {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "وبلاگ مانا",
    "description": "مقالات تخصصی در زمینه برنامه وفاداری مشتریان، مدیریت فروشگاه و افزایش فروش",
    "url": "https://www.gardou.ir/blog",
    "publisher": {
      "@type": "Organization",
      "name": "مانا",
      "url": "https://www.gardou.ir"
    },
    "inLanguage": "fa-IR",
    "blogPost": [] // Will be populated with latest posts
  },

  // Contact Information Schema
  contactInfo: {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "تماس با ما",
    "url": "https://www.gardou.ir/contact",
    "mainEntity": {
      "@type": "Organization",
      "name": "مانا",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+98-21-12345678",
        "contactType": "customer service",
        "email": "info@gardou.ir",
        "availableLanguage": ["Persian", "English"]
      },
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IR",
        "addressRegion": "Tehran",
        "addressLocality": "Tehran"
      }
    }
  },

  // Social Media Profiles Schema
  socialMediaProfiles: {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "مانا",
    "sameAs": [
      "https://www.instagram.com/gardou_ir",
      "https://t.me/gardou_ir",
      "https://www.linkedin.com/company/gardou"
    ]
  }
};

// Generate footer-specific schema
export const generateFooterSchema = (latestPosts: any[] = []) => {
  const schemas: any[] = [
    FOOTER_SCHEMA_MARKUP.organization,
    FOOTER_SCHEMA_MARKUP.siteNavigation,
    FOOTER_SCHEMA_MARKUP.contactInfo,
    FOOTER_SCHEMA_MARKUP.socialMediaProfiles
  ];

  // Add blog schema with latest posts
  if (latestPosts.length > 0) {
    const blogSchema = {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "وبلاگ مانا",
      "description": "مقالات تخصصی در زمینه برنامه وفاداری مشتریان، مدیریت فروشگاه و افزایش فروش",
      "url": "https://www.gardou.ir/blog",
      "publisher": {
        "@type": "Organization",
        "name": "مانا",
        "url": "https://www.gardou.ir"
      },
      "inLanguage": "fa-IR"
    };
    schemas.push(blogSchema);
  }

  return schemas;
};
