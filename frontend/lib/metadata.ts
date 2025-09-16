import { Metadata } from 'next';
import { SEO_CONFIG, PAGE_SEO_CONFIG } from '@/config/seo';
import { generateComprehensiveSchema } from '@/lib/schema';

interface MetadataProps {
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

export function generateMetadata({
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
}: MetadataProps): Metadata {
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

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: seoKeywords,
    robots: robots.join(', '),
    alternates: {
      canonical: seoCanonical,
      languages: SEO_CONFIG.alternateLanguages.reduce((acc, lang) => {
        acc[lang.hreflang] = lang.href;
        return acc;
      }, {} as Record<string, string>)
    },
    openGraph: {
      type: type,
      title: seoTitle,
      description: seoDescription,
      url: seoCanonical,
      images: [
        {
          url: seoImage,
          width: 1200,
          height: 630,
          alt: seoTitle,
        }
      ],
      siteName: SEO_CONFIG.siteName,
      locale: 'fa_IR',
    },
    twitter: {
      card: 'summary_large_image',
      site: SEO_CONFIG.twitterHandle,
      title: seoTitle,
      description: seoDescription,
      images: [seoImage],
    },
    authors: [{ name: author || SEO_CONFIG.businessName }],
    generator: 'Next.js',
    themeColor: '#0066cc',
    other: {
      'application-name': SEO_CONFIG.siteName,
      'msapplication-TileColor': '#0066cc',
      'msapplication-config': '/browserconfig.xml',
    }
  };
}

// Helper function to generate metadata for specific pages
export const getAuthMetadata = () => generateMetadata({
  title: PAGE_SEO_CONFIG.auth.title,
  description: PAGE_SEO_CONFIG.auth.description,
  keywords: PAGE_SEO_CONFIG.auth.keywords,
  canonical: PAGE_SEO_CONFIG.auth.canonical,
  type: 'website'
});

export const getHomeMetadata = () => generateMetadata({
  title: PAGE_SEO_CONFIG.home.title,
  description: PAGE_SEO_CONFIG.home.description,
  keywords: PAGE_SEO_CONFIG.home.keywords,
  canonical: PAGE_SEO_CONFIG.home.canonical,
  type: 'website'
});
