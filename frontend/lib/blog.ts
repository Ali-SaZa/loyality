// Blog content types and SEO configuration
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  category: string;
  tags: string[];
  featuredImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  readingTime: number;
  views: number;
  status: 'published' | 'draft' | 'archived';
  wordCount?: number;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  postCount: number;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  postCount: number;
}

export interface BlogData {
  articles: BlogPost[];
  categories: BlogCategory[];
  tags: BlogTag[];
  metadata: {
    totalArticles: number;
    lastUpdated: string;
    version: string;
  };
}

// Blog SEO Configuration
export const BLOG_SEO_CONFIG = {
  baseUrl: 'https://www.gardou.ir/blog',
  
  // Blog index page
  index: {
    title: 'بلاگ مانا | راهنمای کامل برنامه وفاداری مشتریان',
    description: 'مقالات تخصصی در زمینه برنامه وفاداری مشتریان، مدیریت فروشگاه و افزایش فروش. راهنمای کامل برای کسب و کارهای ایرانی.',
    keywords: 'بلاگ مانا, برنامه وفاداری, مدیریت فروشگاه, مقالات کسب و کار, راهنمای وفاداری مشتریان',
    canonical: 'https://www.gardou.ir/blog'
  },
  
  // Category pages
  category: {
    title: (categoryName: string) => `${categoryName} | بلاگ مانا`,
    description: (categoryName: string) => `مقالات تخصصی در زمینه ${categoryName} برای کسب و کارهای ایرانی. راهنمای کامل برنامه وفاداری مشتریان.`,
    keywords: (categoryName: string) => `${categoryName}, بلاگ مانا, برنامه وفاداری, مدیریت کسب و کار`,
    canonical: (categorySlug: string) => `https://www.gardou.ir/blog/category/${categorySlug}`
  },
  
  // Tag pages
  tag: {
    title: (tagName: string) => `#${tagName} | بلاگ مانا`,
    description: (tagName: string) => `مقالات مرتبط با ${tagName} در بلاگ مانا. راهنمای برنامه وفاداری مشتریان.`,
    keywords: (tagName: string) => `${tagName}, بلاگ مانا, برنامه وفاداری`,
    canonical: (tagSlug: string) => `https://www.gardou.ir/blog/tag/${tagSlug}`
  },
  
  // Individual blog posts
  post: {
    title: (postTitle: string) => `${postTitle} | بلاگ مانا`,
    description: (excerpt: string) => `${excerpt.substring(0, 150)}...`,
    keywords: (tags: string[]) => [...tags, 'بلاگ مانا', 'برنامه وفاداری'],
    canonical: (slug: string) => `https://www.gardou.ir/blog/${slug}`
  }
};

// Load blog data from JSON file
import blogData from '@/data/blog.json';

export const BLOG_DATA: BlogData = blogData as BlogData;
export const BLOG_CATEGORIES: BlogCategory[] = BLOG_DATA.categories;
export const BLOG_TAGS: BlogTag[] = BLOG_DATA.tags;
export const BLOG_POSTS: BlogPost[] = BLOG_DATA.articles.filter(post => post.status === 'published');

// Blog utility functions
export const getBlogPostBySlug = (slug: string): BlogPost | undefined => {
  return BLOG_POSTS.find(post => post.slug === slug);
};

export const getBlogPostsByCategory = (categorySlug: string): BlogPost[] => {
  return BLOG_POSTS.filter(post => post.category === categorySlug);
};

export const getBlogPostsByTag = (tagSlug: string): BlogPost[] => {
  return BLOG_POSTS.filter(post => post.tags.includes(tagSlug));
};

export const getRelatedPosts = (currentPost: BlogPost, limit: number = 3): BlogPost[] => {
  return BLOG_POSTS
    .filter(post => 
      post.id !== currentPost.id && 
      (post.category === currentPost.category || 
       post.tags.some(tag => currentPost.tags.includes(tag)))
    )
    .slice(0, limit);
};

export const getAllBlogPosts = (): BlogPost[] => {
  return BLOG_POSTS;
};

export const getLatestPosts = (limit: number = 5): BlogPost[] => {
  return BLOG_POSTS
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
};

export const getPopularPosts = (limit: number = 5): BlogPost[] => {
  return BLOG_POSTS
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
};

export const formatReadingTime = (minutes: number): string => {
  return `${minutes} دقیقه مطالعه`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
