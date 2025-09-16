import Head from 'next/head';
import { SEO_CONFIG, PAGE_SEO_CONFIG } from '@/config/seo';
import { generateComprehensiveSchema } from '@/lib/schema';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  breadcrumbs?: Array<{name: string, url: string}>;
  noindex?: boolean;
  nofollow?: boolean;
}

export default function SEO({
  title,
  description,
  keywords,
  canonical,
  image,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  breadcrumbs,
  noindex = false,
  nofollow = false
}: SEOProps) {
  // Use defaults if not provided
  const seoTitle = title || SEO_CONFIG.defaultTitle;
  const seoDescription = description || SEO_CONFIG.defaultDescription;
  const seoKeywords = keywords || SEO_CONFIG.defaultKeywords;
  const seoCanonical = canonical || SEO_CONFIG.canonicalUrl;
  const seoImage = image || SEO_CONFIG.defaultImage;

  // Generate robots meta
  const robots = [];
  if (noindex) robots.push('noindex');
  else robots.push('index');
  
  if (nofollow) robots.push('nofollow');
  else robots.push('follow');

  // Generate comprehensive structured data
  const pageType = type === 'article' ? 'article' : 
                   seoCanonical.includes('/blog') ? 'blog' :
                   seoCanonical.includes('/auth') ? 'auth' : 'home';
  
  const structuredData = generateComprehensiveSchema(pageType, {
    title: seoTitle,
    description: seoDescription,
    url: seoCanonical,
    breadcrumbs,
    publishedTime,
    modifiedTime,
    author,
    image: seoImage
  });

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      <meta name="robots" content={robots.join(', ')} />
      <link rel="canonical" href={seoCanonical} />
      
      {/* Language and Locale */}
      <meta httpEquiv="Content-Language" content="fa" />
      <meta property="og:locale" content="fa_IR" />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:url" content={seoCanonical} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={seoTitle} />
      <meta property="og:site_name" content={SEO_CONFIG.siteName} />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={SEO_CONFIG.twitterHandle} />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />
      
      {/* Additional Meta Tags */}
      <meta name="author" content={author || SEO_CONFIG.businessName} />
      <meta name="generator" content="Next.js" />
      <meta name="theme-color" content="#0066cc" />
      
      {/* Article specific meta tags */}
      {type === 'article' && publishedTime && (
        <>
          <meta property="article:published_time" content={publishedTime} />
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {author && <meta property="article:author" content={author} />}
        </>
      )}
      
      {/* Alternate Language Links */}
      {SEO_CONFIG.alternateLanguages.map((lang) => (
        <link key={lang.hreflang} rel="alternate" hrefLang={lang.hreflang} href={lang.href} />
      ))}
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://www.googletagmanager.com" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
      
      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//www.gardou.ir" />
    </Head>
  );
}
