import React from 'react';
import { Button } from '@heroui/button';
import SEO from '@/components/seo/SEO';
import Footer from '@/components/layouts/Footer';
import Navbar from '@/components/layouts/Navbar';
import { BLOG_SEO_CONFIG, BLOG_POSTS, BLOG_CATEGORIES, formatDate, formatReadingTime } from '@/lib/blog';

export default function BlogIndexPage() {
  return (
    <>
      <SEO
        title={BLOG_SEO_CONFIG.index.title}
        description={BLOG_SEO_CONFIG.index.description}
        keywords={BLOG_SEO_CONFIG.index.keywords}
        canonical={BLOG_SEO_CONFIG.index.canonical}
        type="website"
      />
      
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <Navbar />
        
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              وبلاگ مانا
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              راهنمای کامل برنامه وفاداری مشتریان، مدیریت فروشگاه و افزایش فروش
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {BLOG_CATEGORIES.slice(0, 4).map((category) => (
                <Button
                  key={category.id}
                  variant="bordered"
                  color="secondary"
                  size="sm"
                  className="text-white border-white hover:bg-white hover:text-blue-600"
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Posts */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            مقالات برتر
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {BLOG_POSTS.map((post) => (
              <article key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                {post.featuredImage && (
                  <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500"></div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <span>{formatDate(post.publishedAt)}</span>
                    <span>•</span>
                    <span>{formatReadingTime(post.readingTime)}</span>
                    <span>•</span>
                    <span>{post.views} بازدید</span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <Button
                    color="primary"
                    variant="light"
                    size="sm"
                    className="w-full"
                  >
                    مطالعه مقاله
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Categories Section */}
        <section className="bg-white py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              دسته‌بندی مقالات
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {BLOG_CATEGORIES.map((category) => (
                <div key={category.id} className="bg-gray-50 p-6 rounded-lg hover:bg-gray-100 transition-colors">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {category.postCount} مقاله
                    </span>
                    <Button
                      color="primary"
                      variant="light"
                      size="sm"
                    >
                      مشاهده همه
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="bg-blue-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">
              عضو خبرنامه شوید
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              آخرین مقالات و نکات مفید در زمینه برنامه وفاداری مشتریان را دریافت کنید
            </p>
            <div className="max-w-md mx-auto flex gap-4">
              <input
                type="email"
                placeholder="ایمیل خود را وارد کنید"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900"
              />
              <Button
                color="secondary"
                size="lg"
                className="px-8"
              >
                عضویت
              </Button>
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
