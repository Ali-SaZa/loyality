"use client";
import React from "react";
import { Button } from "@heroui/button";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Footer from "@/components/layouts/Footer";
import Navbar from "@/components/layouts/Navbar";
import { siteConfig } from "@/config/site";
import companyInfo from "@/data/company-info.json";

export default function LandingPageClient() {
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect via useEffect
  }

  return (
    <>
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
            "publisher": {
              "@type": "Organization",
              "name": "مانا"
            },
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://www.gardou.ir/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />

      <div className="min-h-screen bg-gray-50">
        <Navbar />

        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              باشگاه وفاداری مشتریان مانا
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              سیستم مدیریت وفاداری مشتریان برای فروشگاه‌ها و کسب و کارهای ایرانی
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                color="secondary"
                className="px-8 py-3 text-lg"
                onClick={() => router.push('/auth')}
              >
                همین الان شروع کنید
              </Button>
              <Button
                size="lg"
                variant="bordered"
                className="px-8 py-3 text-lg border-white text-white hover:bg-white hover:text-primary"
                onClick={() => router.push('/questions')}
              >
                سوالات متداول
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              چرا مانا؟
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">مدیریت آسان</h3>
                <p className="text-gray-600">
                  سیستم ساده و کاربردی برای مدیریت مشتریان و کوپن‌های تخفیف
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📈</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">افزایش فروش</h3>
                <p className="text-gray-600">
                  افزایش فروش تا 40% با برنامه‌های وفاداری موثر
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔒</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">امن و قابل اعتماد</h3>
                <p className="text-gray-600">
                  بالاترین استانداردهای امنیتی برای محافظت از داده‌های شما
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              سوالات متداول
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                {companyInfo.faq.categories.slice(0, 4).map((category) => (
                  <div key={category.title} className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold mb-4 text-primary">
                      {category.title}
                    </h3>
                    <div className="space-y-3">
                      {category.questions.slice(0, 2).map((item, index) => (
                        <div key={index}>
                          <h4 className="font-medium text-gray-900 mb-1">
                            {item.question}
                          </h4>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {item.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-8">
                <Button
                  color="primary"
                  variant="bordered"
                  className="px-6 py-3"
                  onClick={() => router.push('/questions')}
                >
                  مشاهده همه سوالات
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary/20 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
              همین امروز شروع کنید
            </h2>
            <p className="text-xl mb-8 text-gray-900">
              سیستم وفاداری مشتریان خود را راه‌اندازی کنید و فروش خود را افزایش دهید
            </p>
            <Button
              size="lg"
              color="primary"
              className="px-8 py-3 text-lg"
              onClick={() => router.push('/auth')}
            >
              ثبت نام رایگان
            </Button>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
