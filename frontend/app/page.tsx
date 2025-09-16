import { Metadata } from 'next';
import { generateMetadata } from '@/lib/metadata';
import LandingPageClient from '@/components/pages/LandingPageClient';

export const metadata: Metadata = generateMetadata({
  title: "مانا - باشگاه وفاداری مشتریان | سیستم مدیریت وفاداری",
  description: "سیستم مدیریت وفاداری مشتریان برای فروشگاه‌ها و کسب و کارهای ایرانی. ایجاد کوپن تخفیف، مدیریت مشتریان و افزایش فروش.",
  keywords: "برنامه وفاداری مشتریان, سیستم وفاداری, مدیریت فروشگاه, کوپن تخفیف, باشگاه مشتریان",
  canonical: "https://www.gardou.ir",
  type: "website",
});

export default function LandingPage() {
  return <LandingPageClient />;
}