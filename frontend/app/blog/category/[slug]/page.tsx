import React from 'react';
import { Button } from '@heroui/button';
import { Link } from '@heroui/link';
import { Metadata } from 'next';
import Footer from '@/components/layouts/Footer';
import Navbar from '@/components/layouts/Navbar';
import { 
  BLOG_SEO_CONFIG, 
  BLOG_CATEGORIES, 
  getBlogPostsByCategory,
  formatDate, 
  formatReadingTime 
} from '@/lib/blog';
import { generateMetadata as generatePageMetadata } from '@/lib/metadata';

interface BlogCategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all categories
export async function generateStaticParams() {
  return BLOG_CATEGORIES.map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata({ params }: BlogCategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = BLOG_CATEGORIES.find(cat => cat.slug === slug);
  
  if (!category) {
    return generatePageMetadata({
      title: "دسته‌بندی یافت نشد | بلاگ مانا",
      description: "دسته‌بندی مورد نظر یافت نشد.",
      canonical: `https://www.gardou.ir/blog/category/${slug}`,
      type: "website",
    });
  }

  return generatePageMetadata({
    title: BLOG_SEO_CONFIG.category.title(category.name),
    description: BLOG_SEO_CONFIG.category.description(category.name),
    keywords: BLOG_SEO_CONFIG.category.keywords(category.name),
    canonical: BLOG_SEO_CONFIG.category.canonical(category.slug),
    type: "website",
    breadcrumbs: [
      { name: 'خانه', url: '/' },
      { name: 'بلاگ', url: '/blog' },
      { name: category.name, url: `/blog/category/${category.slug}` }
    ],
  });
}

export default async function BlogCategoryPage({ params }: BlogCategoryPageProps) {
  const { slug } = await params;
  const category = BLOG_CATEGORIES.find(cat => cat.slug === slug);
  
  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">دسته‌بندی یافت نشد</h1>
          <Button color="primary" href="/blog">بازگشت به بلاگ</Button>
        </div>
      </div>
    );
  }

  const posts = getBlogPostsByCategory(category.id);

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <Navbar />
        
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            {/* Breadcrumb */}
            <nav className="text-sm mb-6">
              <a href="/" className="hover:text-blue-200">خانه</a>
              <span className="mx-2">/</span>
              <a href="/blog" className="hover:text-blue-200">بلاگ</a>
              <span className="mx-2">/</span>
              <span className="text-blue-200">{category.name}</span>
            </nav>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {category.name}
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              {category.description}
            </p>
            <div className="flex items-center justify-center gap-4 text-blue-100">
              <span>{posts.length} مقاله</span>
              <span>•</span>
              <span>دسته‌بندی مقالات</span>
            </div>
          </div>
        </section>

        {/* Posts Grid */}
        <section className="container mx-auto px-4 py-16">
          {posts.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-3xl font-bold text-gray-900">
                  مقالات {category.name}
                </h2>
                <Link href="/blog">
                  <Button
                    color="primary"
                    variant="light"
                    size="sm"
                  >
                    همه مقالات
                  </Button>
                </Link>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
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
                            className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <Link href={`/blog/${post.slug}`} className="block">
                        <Button
                          color="primary"
                          variant="light"
                          size="sm"
                          className="w-full"
                        >
                          مطالعه مقاله
                        </Button>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                هنوز مقاله‌ای در این دسته‌بندی منتشر نشده است
              </h2>
              <p className="text-gray-600 mb-8">
                به زودی مقالات جدیدی در این دسته‌بندی منتشر خواهیم کرد.
              </p>
              <Link href="/blog">
                <Button color="primary" size="lg">
                  بازگشت به بلاگ
                </Button>
              </Link>
            </div>
          )}
        </section>

        {/* Other Categories */}
        <section className="bg-white py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              سایر دسته‌بندی‌ها
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {BLOG_CATEGORIES.filter(cat => cat.slug !== slug).map((otherCategory) => (
                <div key={otherCategory.id} className="bg-gray-50 p-6 rounded-lg hover:bg-gray-100 transition-colors">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {otherCategory.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {otherCategory.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {otherCategory.postCount} مقاله
                    </span>
                    <Link href={`/blog/category/${otherCategory.slug}`}>
                      <Button
                        color="primary"
                        variant="light"
                        size="sm"
                      >
                        مشاهده همه
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
