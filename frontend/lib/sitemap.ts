// Sitemap generator for مانا Loyalty Program
export const generateSitemap = () => {
  const baseUrl = 'https://www.gardou.ir';
  const currentDate = new Date().toISOString();
  
  // Only include PUBLIC pages in sitemap
  // Private pages (admin, store, customer) are excluded as they require authentication
  const staticPages = [
    {
      url: '',
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '1.0'
    },
    {
      url: '/auth',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.8'
    },
    {
      url: '/auth/promo-registration',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.7'
    },
    {
      url: '/blog',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.9'
    }
    // Note: Admin, Store, and Customer pages are PRIVATE and excluded from sitemap
    // They require authentication and should not be indexed by search engines
  ];

  // Add blog posts to sitemap (dynamically from JSON)
  const blogPosts = [
    {
      url: '/blog/complete-guide-customer-loyalty-program',
      lastmod: '2024-01-15T10:00:00Z',
      changefreq: 'monthly',
      priority: '0.8'
    },
    {
      url: '/blog/10-effective-techniques-increase-sales',
      lastmod: '2024-01-10T14:30:00Z',
      changefreq: 'monthly',
      priority: '0.8'
    },
    {
      url: '/blog/role-coupon-discount-attract-new-customers',
      lastmod: '2024-01-05T09:15:00Z',
      changefreq: 'monthly',
      priority: '0.8'
    },
    {
      url: '/blog/how-to-implement-customer-loyalty-program',
      lastmod: '2024-01-01T12:00:00Z',
      changefreq: 'monthly',
      priority: '0.8'
    },
    {
      url: '/blog/comparison-different-loyalty-systems',
      lastmod: '2023-12-28T16:45:00Z',
      changefreq: 'monthly',
      priority: '0.8'
    },
    {
      url: '/blog/golden-tips-customer-retention-retail',
      lastmod: '2023-12-25T11:30:00Z',
      changefreq: 'monthly',
      priority: '0.8'
    },
    {
      url: '/blog/guide-choose-best-loyalty-platform',
      lastmod: '2023-12-20T14:15:00Z',
      changefreq: 'monthly',
      priority: '0.8'
    },
    {
      url: '/blog/success-story-clothing-store-loyalty-program',
      lastmod: '2023-12-15T10:20:00Z',
      changefreq: 'monthly',
      priority: '0.8'
    },
    {
      url: '/blog/sms-marketing-guide-retail-stores',
      lastmod: '2023-12-10T13:45:00Z',
      changefreq: 'monthly',
      priority: '0.8'
    },
    {
      url: '/blog/sales-data-analysis-improve-business',
      lastmod: '2023-12-05T09:30:00Z',
      changefreq: 'monthly',
      priority: '0.8'
    }
  ];

  const allPages = [...staticPages, ...blogPosts];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return sitemap;
};

// Robots.txt generator
export const generateRobotsTxt = () => {
  return `User-agent: *
Allow: /

# Disallow private/authenticated areas (no SEO needed)
Disallow: /admin/
Disallow: /store/
Disallow: /customer/
Disallow: /api/
Disallow: /_next/
Disallow: /static/

# Allow public pages only
Allow: /auth
Allow: /auth/promo-registration
Allow: /blog
Allow: /blog/
Allow: /

# Sitemap (only contains public pages)
Sitemap: https://www.gardou.ir/sitemap.xml

# Crawl delay
Crawl-delay: 1`;
};
