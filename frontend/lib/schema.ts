// Advanced Schema Markup for مانا Loyalty Program
export const ADVANCED_SCHEMA_MARKUP = {
  // Organization Schema
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
      "telephone": "+98-921-5501953",
      "contactType": "customer service",
      "email": "info@gardou.ir",
      "availableLanguage": ["Persian", "English"]
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IR",
      "addressRegion": "Mashhad",
      "addressLocality": "Mashhad",
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
        }
      ]
    }
  },

  // Software Application Schema
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
      "availability": "https://schema.org/InStock",
      "validFrom": "2024-01-01"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "150",
      "bestRating": "5",
      "worstRating": "1"
    },
    "screenshot": "https://www.gardou.ir/images/app-screenshot.png",
    "softwareVersion": "1.0.0",
    "releaseNotes": "نسخه اولیه سیستم وفاداری مشتریان مانا",
    "featureList": [
      "مدیریت کوپن تخفیف",
      "سیستم امتیازدهی",
      "تحلیل مشتریان",
      "گزارش‌گیری جامع",
      "بازاریابی پیامکی"
    ]
  },

  // Local Business Schema
  localBusiness: {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "مانا",
    "description": "سیستم مدیریت وفاداری مشتریان برای کسب و کارهای ایرانی",
    "url": "https://www.gardou.ir",
    "telephone": "+98-921-5501953",
    "email": "info@gardou.ir",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IR",
      "addressRegion": "Mashhad",
      "addressLocality": "Mashhad"
    },
    "openingHours": "Mo-Fr 09:00-18:00",
    "priceRange": "$$",
    "paymentAccepted": "Credit Card, Bank Transfer",
    "currenciesAccepted": "IRR",
    "areaServed": {
      "@type": "Country",
      "name": "Iran"
    }
  },

  // Service Schema
  service: {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "سیستم مدیریت وفاداری مشتریان",
    "description": "راه‌اندازی و مدیریت برنامه وفاداری مشتریان برای فروشگاه‌ها و کسب و کارها",
    "provider": {
      "@type": "Organization",
      "name": "مانا",
      "url": "https://www.gardou.ir"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Iran"
    },
    "serviceType": "Software as a Service",
    "category": "Customer Loyalty Management",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "IRR",
      "availability": "https://schema.org/InStock"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "خدمات وفاداری مشتریان",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "راه‌اندازی برنامه وفاداری",
            "description": "طراحی و پیاده‌سازی برنامه وفاداری مشتریان"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "مدیریت کوپن تخفیف",
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

  // FAQ Schema
  faq: {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "سیستم وفاداری مشتریان چیست؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "سیستم وفاداری مشتریان مجموعه‌ای از ابزارها و استراتژی‌هاست که برای حفظ و تشویق مشتریان به خریدهای مکرر طراحی شده است."
        }
      },
      {
        "@type": "Question",
        "name": "چگونه کوپن تخفیف ایجاد کنم؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "در پنل مدیریت مانا، بخش کوپن‌های تخفیف را انتخاب کرده و با چند کلیک ساده کوپن مورد نظر خود را ایجاد کنید."
        }
      },
      {
        "@type": "Question",
        "name": "آیا سیستم امن است؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "بله، مانا از بالاترین استانداردهای امنیتی استفاده می‌کند و تمام داده‌های شما محافظت می‌شود."
        }
      }
    ]
  },

  // Breadcrumb Schema
  breadcrumbList: (items: Array<{name: string, url: string}>) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  }),

  // Article Schema
  article: (post: any) => ({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title || "",
    "description": post.excerpt || post.description || "",
    "image": post.featuredImage || post.image || "",
    "author": {
      "@type": "Organization",
      "name": post.author || "تیم مانا"
    },
    "publisher": {
      "@type": "Organization",
      "name": "مانا",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.gardou.ir/images/logo.png"
      }
    },
    "datePublished": post.publishedAt || post.publishedTime || new Date().toISOString(),
    "dateModified": post.updatedAt || post.modifiedTime || new Date().toISOString(),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": post.url || `https://www.gardou.ir/blog/${post.slug || 'article'}`
    },
    "articleSection": post.category || "عمومی",
    "keywords": post.tags ? post.tags.join(", ") : "",
    "wordCount": post.wordCount || 0,
    "timeRequired": `PT${post.readingTime || 5}M`
  }),

  // WebSite Schema
  website: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "مانا - باشگاه وفاداری مشتریان",
    "url": "https://www.gardou.ir",
    "description": "سیستم مدیریت وفاداری مشتریان برای فروشگاه‌ها و کسب و کارهای ایرانی",
    "publisher": {
      "@type": "Organization",
      "name": "مانا"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.gardou.ir/blog?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "sameAs": [
      "https://www.instagram.com/gardou_ir",
      "https://t.me/gardou_ir"
    ]
  },

  // WebPage Schema
  webpage: (page: any) => ({
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": page.title || "",
    "description": page.description || "",
    "url": page.url || "",
    "isPartOf": {
      "@type": "WebSite",
      "name": "مانا - باشگاه وفاداری مشتریان",
      "url": "https://www.gardou.ir"
    },
    "about": {
      "@type": "Thing",
      "name": "برنامه وفاداری مشتریان"
    },
    "mainEntity": {
      "@type": "SoftwareApplication",
      "name": "مانا"
    }
  })
};

// Generate comprehensive schema markup
export const generateComprehensiveSchema = (pageType: string, data?: any) => {
  const schemas: any[] = [ADVANCED_SCHEMA_MARKUP.organization, ADVANCED_SCHEMA_MARKUP.softwareApplication];

  switch (pageType) {
    case 'home':
      schemas.push(ADVANCED_SCHEMA_MARKUP.website, ADVANCED_SCHEMA_MARKUP.faq);
      break;
    case 'blog':
      schemas.push(ADVANCED_SCHEMA_MARKUP.website);
      break;
    case 'article':
      if (data) {
        schemas.push(ADVANCED_SCHEMA_MARKUP.article(data));
        if (data.breadcrumbs) {
          schemas.push(ADVANCED_SCHEMA_MARKUP.breadcrumbList(data.breadcrumbs));
        }
      }
      break;
    case 'auth':
      if (data) {
        schemas.push(ADVANCED_SCHEMA_MARKUP.webpage(data));
      }
      break;
  }

  return schemas;
};
