import { NextRequest, NextResponse } from 'next/server';
import { generateSitemap, generateRobotsTxt } from '@/lib/sitemap';

export async function GET(request: NextRequest) {
  const sitemap = generateSitemap();
  
  return new NextResponse(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
