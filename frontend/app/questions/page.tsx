import React from "react";
import { Metadata } from "next";
import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";
import { generateMetadata } from "@/lib/metadata";
import companyInfo from "@/data/company-info.json";

export const metadata: Metadata = generateMetadata({
  title: "سوالات متداول | مانا - باشگاه وفاداری مشتریان",
  description:
    "پاسخ سوالات رایج شما درباره سیستم وفاداری مشتریان مانا. سوالات فنی، کسب و کار و عمومی.",
  keywords: "سوالات متداول مانا, FAQ مانا, راهنمای مانا, پشتیبانی مانا",
  canonical: "https://www.gardou.ir/questions",
  type: "website",
});

export default function QuestionsPage() {
  const { faq } = companyInfo;

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{faq.title}</h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">{faq.description}</p>
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            {faq.categories.map((category, categoryIndex) => (
              <div key={category.id} className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                  {category.title}
                </h2>
                <div className="space-y-6">
                  {category.questions.map((item, questionIndex) => (
                    <div
                      key={item.id}
                      className="bg-white p-6 rounded-lg shadow-lg"
                    >
                      <h3 className="text-lg font-semibold mb-4 text-blue-600">
                        {item.question}
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
