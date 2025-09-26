// Internal Linking Strategy for مانا SEO
export const INTERNAL_LINKING_STRATEGY = {
  // Main navigation links
  mainNavigation: [
    { text: 'خانه', url: '/', priority: 'high' },
    { text: 'بلاگ', url: '/blog', priority: 'high' },
    { text: 'ورود', url: '/auth', priority: 'medium' },
    { text: 'درباره ما', url: '/about', priority: 'low' },
    { text: 'تماس با ما', url: '/contact', priority: 'low' }
  ],

  // Blog internal links
  blogInternalLinks: [
    {
      from: 'complete-guide-customer-loyalty-program',
      to: [
        { url: '/blog/how-to-implement-customer-loyalty-program', anchor: 'پیاده‌سازی برنامه وفاداری' },
        { url: '/blog/comparison-different-loyalty-systems', anchor: 'مقایسه سیستم‌های وفاداری' },
        { url: '/blog/guide-choose-best-loyalty-platform', anchor: 'انتخاب پلتفرم وفاداری' }
      ]
    },
    {
      from: '10-effective-techniques-increase-sales',
      to: [
        { url: '/blog/role-coupon-discount-attract-new-customers', anchor: 'کوپن تخفیف' },
        { url: '/blog/sms-marketing-guide-retail-stores', anchor: 'بازاریابی پیامکی' },
        { url: '/blog/sales-data-analysis-improve-business', anchor: 'تحلیل داده‌های فروش' }
      ]
    },
    {
      from: 'role-coupon-discount-attract-new-customers',
      to: [
        { url: '/blog/complete-guide-customer-loyalty-program', anchor: 'برنامه وفاداری' },
        { url: '/blog/10-effective-techniques-increase-sales', anchor: 'افزایش فروش' },
        { url: '/blog/golden-tips-customer-retention-retail', anchor: 'حفظ مشتری' }
      ]
    }
  ],

  // Cross-linking between pages
  crossLinks: [
    {
      from: '/',
      to: [
        { url: '/blog/complete-guide-customer-loyalty-program', anchor: 'راهنمای کامل برنامه وفاداری' },
        { url: '/blog/10-effective-techniques-increase-sales', anchor: '10 تکنیک افزایش فروش' },
        { url: '/blog/success-story-clothing-store-loyalty-program', anchor: 'داستان موفقیت' }
      ]
    },
    {
      from: '/blog',
      to: [
        { url: '/blog/complete-guide-customer-loyalty-program', anchor: 'راهنمای کامل برنامه وفاداری' },
        { url: '/blog/10-effective-techniques-increase-sales', anchor: '10 تکنیک افزایش فروش' },
        { url: '/blog/success-story-clothing-store-loyalty-program', anchor: 'داستان موفقیت' }
      ]
    }
  ],

  // Related articles mapping
  relatedArticles: {
    'complete-guide-customer-loyalty-program': [
      'how-to-implement-customer-loyalty-program',
      'comparison-different-loyalty-systems',
      'guide-choose-best-loyalty-platform'
    ],
    '10-effective-techniques-increase-sales': [
      'role-coupon-discount-attract-new-customers',
      'sms-marketing-guide-retail-stores',
      'sales-data-analysis-improve-business'
    ],
    'role-coupon-discount-attract-new-customers': [
      'complete-guide-customer-loyalty-program',
      '10-effective-techniques-increase-sales',
      'golden-tips-customer-retention-retail'
    ]
  } as Record<string, string[]>,

  // Anchor text variations
  anchorTexts: {
    'برنامه وفاداری': [
      'برنامه وفاداری مشتریان',
      'سیستم وفاداری',
      'برنامه وفاداری',
      'وفاداری مشتریان'
    ],
    'افزایش فروش': [
      'افزایش فروش',
      'تکنیک‌های فروش',
      'بهبود فروش',
      'فروش بیشتر'
    ],
    'کوپن تخفیف': [
      'کوپن تخفیف',
      'تخفیف',
      'کوپن',
      'کد پروموشن'
    ],
    'حفظ مشتری': [
      'حفظ مشتری',
      'وفاداری مشتری',
      'نگهداری مشتری',
      'مشتری‌داری'
    ]
  } as Record<string, string[]>
};

// Generate internal links for a specific page
export const generateInternalLinks = (currentSlug: string, allPosts: any[]) => {
  const strategy = INTERNAL_LINKING_STRATEGY;
  const links: any[] = [];

  // Add related articles
  if (strategy.relatedArticles[currentSlug]) {
    strategy.relatedArticles[currentSlug].forEach(relatedSlug => {
      const relatedPost = allPosts.find(post => post.slug === relatedSlug);
      if (relatedPost) {
        links.push({
          url: `/blog/${relatedSlug}`,
          text: relatedPost.title,
          type: 'related'
        });
      }
    });
  }

  // Add cross-links
  strategy.crossLinks.forEach(crossLink => {
    if (crossLink.from === `/blog/${currentSlug}`) {
      crossLink.to.forEach(link => {
        links.push({
          url: link.url,
          text: link.anchor,
          type: 'cross'
        });
      });
    }
  });

  return links;
};

// Generate contextual internal links
export const generateContextualLinks = (content: string, currentSlug: string) => {
  const strategy = INTERNAL_LINKING_STRATEGY;
  let enhancedContent = content;

  // Add internal links based on keywords
  Object.keys(strategy.anchorTexts).forEach(keyword => {
    const variations = strategy.anchorTexts[keyword];
    const targetUrl = getTargetUrl(keyword);
    
    if (targetUrl) {
      variations.forEach(variation => {
        const regex = new RegExp(`(${variation})`, 'gi');
        enhancedContent = enhancedContent.replace(regex, `<a href="${targetUrl}" class="text-blue-600 hover:underline">$1</a>`);
      });
    }
  });

  return enhancedContent;
};

// Get target URL for keyword
const getTargetUrl = (keyword: string): string | null => {
  const urlMap: Record<string, string> = {
    'برنامه وفاداری': '/blog/complete-guide-customer-loyalty-program',
    'افزایش فروش': '/blog/10-effective-techniques-increase-sales',
    'کوپن تخفیف': '/blog/role-coupon-discount-attract-new-customers',
    'حفظ مشتری': '/blog/golden-tips-customer-retention-retail'
  };
  
  return urlMap[keyword] || null;
};
