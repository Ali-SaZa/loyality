import React from 'react';
import { Metadata } from 'next';
import Navbar from '@/components/layouts/Navbar';
import Footer from '@/components/layouts/Footer';
import { generateMetadata } from '@/lib/metadata';
import companyInfo from '@/data/company-info.json';

export const metadata: Metadata = generateMetadata({
  title: 'درباره ما | مانا - باشگاه وفاداری مشتریان',
  description: 'درباره مانا - پیشگام در سیستم مدیریت وفاداری مشتریان. ماموریت، چشم‌انداز و ارزش‌های ما را بشناسید.',
  keywords: 'درباره مانا, ماموریت مانا, چشم‌انداز مانا, تیم مانا, ارزش‌های مانا',
  canonical: 'https://www.gardou.ir/about-us',
  type: 'website'
});

export default function AboutUsPage() {
  const { aboutUs } = companyInfo;

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {aboutUs.title}
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              {aboutUs.subtitle}
            </p>
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-16">
          {/* Description */}
          <section className="mb-16">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-lg text-gray-700 leading-relaxed">
                {aboutUs.description}
              </p>
            </div>
          </section>

          {/* Mission & Vision */}
          <section className="mb-16">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {aboutUs.mission.title}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {aboutUs.mission.description}
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {aboutUs.vision.title}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {aboutUs.vision.description}
                </p>
              </div>
            </div>
          </section>

          {/* Values */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              {aboutUs.values.title}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {aboutUs.values.items.map((value, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-lg text-center">
                  <h3 className="text-xl font-semibold mb-4 text-blue-600">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Team Stats */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              {aboutUs.team.title}
            </h2>
            <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
              <p className="text-lg text-gray-700 text-center mb-8">
                {aboutUs.team.description}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {aboutUs.team.stats.employees}
                  </div>
                  <div className="text-gray-600">کارمند</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {aboutUs.team.stats.experience}
                  </div>
                  <div className="text-gray-600">سال تجربه</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {aboutUs.team.stats.clients}
                  </div>
                  <div className="text-gray-600">مشتری</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {aboutUs.team.stats.projects}
                  </div>
                  <div className="text-gray-600">پروژه</div>
                </div>
              </div>
            </div>
          </section>

          {/* Achievements */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              {aboutUs.achievements.title}
            </h2>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="grid md:grid-cols-2 gap-6">
                {aboutUs.achievements.items.map((achievement, index) => (
                  <div key={index} className="flex items-start">
                    <span className="text-green-500 mr-3 text-xl">✓</span>
                    <span className="text-gray-700">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <Footer />
      </div>
    </>
  );
}
