import React from 'react';
import { Metadata } from 'next';
import { Button } from '@heroui/button';
import Navbar from '@/components/layouts/Navbar';
import Footer from '@/components/layouts/Footer';
import { generateMetadata } from '@/lib/metadata';
import companyInfo from '@/data/company-info.json';

export const metadata: Metadata = generateMetadata({
  title: 'تماس با ما | مانا - باشگاه وفاداری مشتریان',
  description: 'تماس با تیم مانا. آدرس، شماره تماس، ایمیل و اطلاعات تماس کامل ما را مشاهده کنید.',
  keywords: 'تماس با مانا, آدرس مانا, شماره تماس مانا, پشتیبانی مانا',
  canonical: 'https://www.gardou.ir/contact-us',
  type: 'website'
});

export default function ContactUsPage() {
  const { contactUs } = companyInfo;

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {contactUs.title}
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              {contactUs.description}
            </p>
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              {/* Address */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">
                  {contactUs.address.title}
                </h2>
                <p className="text-gray-700">
                  {contactUs.address.fullAddress}
                </p>
              </div>

              {/* Phone */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">
                  {contactUs.phone.title}
                </h2>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <strong>پشتیبانی:</strong> {contactUs.phone.primary}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">
                  {contactUs.email.title}
                </h2>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <strong>اطلاعات:</strong> {contactUs.email.info}
                  </p>
                  <p className="text-gray-700">
                    <strong>پشتیبانی:</strong> {contactUs.email.support}
                  </p>
                  <p className="text-gray-700">
                    <strong>فروش:</strong> {contactUs.email.sales}
                  </p>
                </div>
              </div>

              {/* Working Hours */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">
                  {contactUs.workingHours.title}
                </h2>
                <div className="space-y-2">
                  <p className="text-gray-700">{contactUs.workingHours.weekdays}</p>
                  <p className="text-gray-700">{contactUs.workingHours.weekend}</p>
                  <p className="text-gray-700">{contactUs.workingHours.friday}</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">
                پیام خود را برای ما ارسال کنید
              </h2>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      نام و نام خانوادگی
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      ایمیل
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    شماره تماس
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    موضوع
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    پیام
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  ></textarea>
                </div>

                <Button
                  type="submit"
                  color="primary"
                  size="lg"
                  className="w-full"
                >
                  ارسال پیام
                </Button>
              </form>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-16 bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              {contactUs.additionalInfo.title}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2 text-blue-600">
                  زمان پاسخگویی
                </h3>
                <p className="text-gray-700">{contactUs.additionalInfo.responseTime}</p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2 text-blue-600">
                  زبان‌های پشتیبانی
                </h3>
                <p className="text-gray-700">{contactUs.additionalInfo.languages}</p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2 text-blue-600">
                  منطقه زمانی
                </h3>
                <p className="text-gray-700">{contactUs.additionalInfo.timezone}</p>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="mt-8 bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              {contactUs.socialMedia.title}
            </h2>
            <div className="flex justify-center space-x-6">
              <a
                href={contactUs.socialMedia.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 hover:text-pink-800 text-2xl"
              >
                📷 اینستاگرام
              </a>
              <a
                href={contactUs.socialMedia.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-2xl"
              >
                📱 تلگرام
              </a>
              <a
                href={contactUs.socialMedia.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:text-blue-900 text-2xl"
              >
                💼 لینکدین
              </a>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
