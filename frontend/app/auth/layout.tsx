import { Metadata } from 'next';
import { getAuthMetadata } from '@/lib/metadata';
import { generateComprehensiveSchema } from '@/lib/schema';
import { PAGE_SEO_CONFIG } from '@/config/seo';

export const metadata: Metadata = getAuthMetadata();

// Add structured data for auth page
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = generateComprehensiveSchema('auth', {
    title: PAGE_SEO_CONFIG.auth.title,
    description: PAGE_SEO_CONFIG.auth.description,
    url: PAGE_SEO_CONFIG.auth.canonical,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      {children}
    </>
  );
}