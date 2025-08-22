import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

@Injectable()
export class RateLimiterMiddleware implements NestMiddleware {
  private rateLimitStore = new Map<string, RateLimitEntry>();
  private readonly WINDOW_MS = 15 * 60 * 1000; // 15 minutes
  private readonly MAX_REQUESTS = 100; // Max requests per window

  use(req: Request, res: Response, next: NextFunction) {
    const clientIp = this.getClientIp(req);
    const now = Date.now();
    
    // Clean up expired entries
    this.cleanupExpiredEntries(now);
    
    // Get or create rate limit entry for this IP
    let entry = this.rateLimitStore.get(clientIp);
    
    if (!entry || now > entry.resetTime) {
      entry = {
        count: 0,
        resetTime: now + this.WINDOW_MS,
      };
    }
    
    // Check if rate limit exceeded
    if (entry.count >= this.MAX_REQUESTS) {
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
      res.setHeader('Retry-After', retryAfter);
      throw new HttpException(
        'Rate limit exceeded. Please try again later.',
        HttpStatus.TOO_MANY_REQUESTS
      );
    }
    
    // Increment request count
    entry.count++;
    this.rateLimitStore.set(clientIp, entry);
    
    // Add rate limit headers
    res.setHeader('X-RateLimit-Limit', this.MAX_REQUESTS);
    res.setHeader('X-RateLimit-Remaining', this.MAX_REQUESTS - entry.count);
    res.setHeader('X-RateLimit-Reset', new Date(entry.resetTime).toISOString());
    
    next();
  }
  
  private getClientIp(req: Request): string {
    return (
      req.headers['x-forwarded-for'] as string ||
      req.headers['x-real-ip'] as string ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      'unknown'
    );
  }
  
  private cleanupExpiredEntries(now: number): void {
    for (const [key, entry] of this.rateLimitStore.entries()) {
      if (now > entry.resetTime) {
        this.rateLimitStore.delete(key);
      }
    }
  }
}
