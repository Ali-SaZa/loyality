"use client";
import React from "react";
import { Button } from "@heroui/button";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import SEO from "@/components/seo/SEO";
import { PAGE_SEO_CONFIG } from "@/config/seo";
import Footer from "@/components/layouts/Footer";
import Navbar from "@/components/layouts/Navbar";
import { siteConfig } from "@/config/site";
import companyInfo from "@/data/company-info.json";

export default function LandingPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      const roleMenu = siteConfig.roleMenus[user.role as keyof typeof siteConfig.roleMenus];
      if (roleMenu && roleMenu.length > 0) {
        router.push(roleMenu[0].link);
      }
    }
  }, [user, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-light">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect via useEffect
  }

  return (
    <>
      <SEO
        title={PAGE_SEO_CONFIG.home.title}
        description={PAGE_SEO_CONFIG.home.description}
        keywords={PAGE_SEO_CONFIG.home.keywords}
        canonical={PAGE_SEO_CONFIG.home.canonical}
        type="website"
      />
      
      {/* Additional JSON-LD for Homepage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "مانا - باشگاه وفاداری مشتریان",
            "url": "https://www.gardou.ir",
            "description": "سیستم مدیریت وفاداری مشتریان برای فروشگاه‌ها و کسب و کارهای ایرانی",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://www.gardou.ir/blog?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Navigation */}
        <Navbar />
        
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              مانا - باشگاه وفاداری مشتریان
              <span className="text-blue-600 block">هوشمند</span>
            </h1>
            
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              سیستم مدیریت وفاداری مشتریان برای فروشگاه‌ها و کسب و کارهای ایرانی. 
              ایجاد کوپن تخفیف، مدیریت مشتریان و افزایش فروش با تکنولوژی پیشرفته.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                color="primary"
                className="text-lg px-8 py-4"
                onClick={() => router.push('/auth')}
              >
                شروع رایگان
              </Button>
              <Button
                size="lg"
                variant="bordered"
                color="primary"
                className="text-lg px-8 py-4"
                onClick={() => router.push('/blog')}
              >
                مشاهده مقالات
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            ویژگی‌های سیستم وفاداری مانا
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">مدیریت کوپن تخفیف</h3>
              <p className="text-gray-600">
                ایجاد و مدیریت کوپن‌های تخفیف مختلف برای جذب مشتریان جدید و حفظ مشتریان موجود.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">تحلیل مشتریان</h3>
              <p className="text-gray-600">
                گزارش‌گیری جامع از رفتار مشتریان و تحلیل داده‌های فروش برای بهبود استراتژی‌ها.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">سیستم امتیازدهی</h3>
              <p className="text-gray-600">
                سیستم امتیازدهی هوشمند برای تشویق مشتریان به خریدهای بیشتر و وفاداری.
              </p>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="bg-white py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              چرا مانا را انتخاب کنید؟
            </h2>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-semibold mb-6">افزایش فروش تا 40%</h3>
                <ul className="space-y-4 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    سیستم وفاداری مشتریان اثبات شده
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    مدیریت آسان کوپن‌های تخفیف
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    گزارش‌گیری جامع و دقیق
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    پشتیبانی 24 ساعته
                  </li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-lg">
                <h4 className="text-xl font-semibold mb-4">آمار موفقیت</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">500+</div>
                    <div className="text-sm">فروشگاه فعال</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">50K+</div>
                    <div className="text-sm">مشتری راضی</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {companyInfo.faq.title}
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {companyInfo.faq.categories[0].questions.slice(0, 3).map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">
                  {item.question}
                </h3>
                <p className="text-gray-600">
                  {item.answer}
                </p>
              </div>
            ))}
            
            <div className="text-center mt-8">
              <a
                href="/questions"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
              >
                مشاهده همه سوالات
              </a>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-blue-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">
              همین امروز شروع کنید
            </h2>
            <p className="text-xl mb-8">
              سیستم وفاداری مشتریان خود را راه‌اندازی کنید و فروش خود را افزایش دهید
            </p>
            <Button
              size="lg"
              color="secondary"
              className="text-lg px-8 py-4"
              onClick={() => router.push('/auth')}
            >
              ثبت نام رایگان
            </Button>
          </div>
        </section>
        
        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
