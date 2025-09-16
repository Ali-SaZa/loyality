import React from 'react';
import { Button } from '@heroui/button';
import SEO from '@/components/seo/SEO';
import { 
  BLOG_SEO_CONFIG, 
  getBlogPostBySlug, 
  getRelatedPosts, 
  formatDate, 
  formatReadingTime,
  BLOG_CATEGORIES 
} from '@/lib/blog';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  
  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">مقاله یافت نشد</h1>
          <Button color="primary" href="/blog">بازگشت به وبلاگ</Button>
        </div>
      </div>
    );
  }

  const relatedPosts = getRelatedPosts(post);
  const category = BLOG_CATEGORIES.find(cat => cat.id === post.category);

  return (
    <>
      <SEO
        title={post.seoTitle || BLOG_SEO_CONFIG.post.title(post.title)}
        description={post.seoDescription || BLOG_SEO_CONFIG.post.description(post.excerpt)}
        keywords={post.seoKeywords?.join(', ') || BLOG_SEO_CONFIG.post.keywords(post.tags).join(', ')}
        canonical={BLOG_SEO_CONFIG.post.canonical(post.slug)}
        type="article"
        publishedTime={post.publishedAt}
        modifiedTime={post.updatedAt}
        author={post.author}
        breadcrumbs={[
          { name: 'خانه', url: '/' },
          { name: 'وبلاگ', url: '/blog' },
          { name: post.title, url: `/blog/${post.slug}` }
        ]}
      />
      
      <div className="min-h-screen bg-white">
        {/* Article Header */}
        <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Breadcrumb */}
              <nav className="text-sm mb-6">
                <a href="/" className="hover:text-blue-200">خانه</a>
                <span className="mx-2">/</span>
                <a href="/blog" className="hover:text-blue-200">وبلاگ</a>
                <span className="mx-2">/</span>
                <span className="text-blue-200">{post.title}</span>
              </nav>
              
              {/* Category */}
              {category && (
                <div className="mb-4">
                  <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">
                    {category.name}
                  </span>
                </div>
              )}
              
              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                {post.title}
              </h1>
              
              {/* Meta */}
              <div className="flex flex-wrap items-center gap-6 text-blue-100">
                <div className="flex items-center gap-2">
                  <span>نویسنده:</span>
                  <span className="font-semibold">{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>تاریخ:</span>
                  <span>{formatDate(post.publishedAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>زمان مطالعه:</span>
                  <span>{formatReadingTime(post.readingTime)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>بازدید:</span>
                  <span>{post.views.toLocaleString('fa-IR')}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Article Content */}
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Featured Image */}
            {post.featuredImage && (
              <div className="mb-12">
                <div className="h-64 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg"></div>
              </div>
            )}
            
            {/* Article Body */}
            <article className="prose prose-lg max-w-none">
              <div 
                className="text-gray-700 leading-relaxed text-lg"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </article>
            
            {/* Tags */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">برچسب‌ها:</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full hover:bg-blue-200 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Share Buttons */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">اشتراک‌گذاری:</h3>
              <div className="flex gap-4">
                <Button color="primary" variant="bordered" size="sm">
                  تلگرام
                </Button>
                <Button color="primary" variant="bordered" size="sm">
                  واتساپ
                </Button>
                <Button color="primary" variant="bordered" size="sm">
                  لینکدین
                </Button>
              </div>
            </div>
          </div>
        </main>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="bg-gray-50 py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                مقالات مرتبط
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {relatedPosts.map((relatedPost) => (
                  <article key={relatedPost.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500"></div>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {relatedPost.excerpt}
                      </p>
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
            </div>
          </section>
        )}
      </div>
    </>
  );
}
